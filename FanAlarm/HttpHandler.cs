using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Threading.Tasks;
using FanAlarm.Exceptions;
using FanAlarm.Interfaces;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace FanAlarm
{
    public class HttpHandler :IHttpHandler
    {
        private static readonly HttpClient client = new HttpClient { Timeout = TimeSpan.FromMilliseconds(100000) };

        public async Task<TResponseData> GetJsonAsync<TResponseData>(string url)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var result = await SendAsync(request);
            return DeserializeJsonFromStream<TResponseData>(result);
        }

        public async Task<TResponseData> PostJsonAsync<TResponseData>(string url, object data)
        {
            HttpRequestMessage request = BuildJsonRequestMessage(url, data);
            var result = await SendAsync(request);
            return DeserializeJsonFromStream<TResponseData>(result);
        }

        public async Task<Stream> SendAsync(HttpRequestMessage request)
        {
            var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
            return await BuildSendResponse(response);
        }

        public async Task<Stream> BuildSendResponse(HttpResponseMessage response)
        {
            var stream = await response.Content.ReadAsStreamAsync();

            if (response.IsSuccessStatusCode)
                return stream;

            var content = await StreamToStringAsync(stream);

            ApiErrorException apiError = null;
            try
            {
                apiError = JsonConvert.DeserializeObject<ApiErrorException>(content);
            }
            catch (Exception)
            {
                throw new ApiException
                {
                    StatusCode = (int)response.StatusCode,
                    Content = content
                };
            }

            if (apiError != null)
            {
                throw apiError;
            }

            throw new ApiErrorException();
        }

        public TData DeserializeJsonFromStream<TData>(Stream stream)
        {
            if (stream == null || stream.CanRead == false)
                return default(TData);

            using (var sr = new StreamReader(stream))
            using (var jtr = new JsonTextReader(sr))
            {
                return JsonSerializer.Create().Deserialize<TData>(jtr);
            }
        }

        public async Task<string> StreamToStringAsync(Stream stream)
        {
            string content = null;

            if (stream != null)
                using (var sr = new StreamReader(stream))
                    content = await sr.ReadToEndAsync();

            return content;
        }

        public HttpRequestMessage BuildJsonRequestMessage(string url, object data)
        {
            return new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json")
            };
        }
    }
}
