using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FanAlarm.Models;
using FanAlarm.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Text.Json;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http.Headers;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FanAlarm.Controllers
{
    public class ConcertController : Controller
    {
        private readonly IOptions<AppSettingsModel> _appSettings;
        private readonly IConcertsSqlServerService _concertsSqlServerService;

        public ConcertController(IOptions<AppSettingsModel> appSettings, IConcertsSqlServerService concertsSqlServerService)
        {
            _appSettings = appSettings;
            _concertsSqlServerService = concertsSqlServerService;

        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpGet()]
        [Route("api/getconcert/{name}")]
        public async Task<IActionResult> GetConcert(string name)
        {

            var connectionstring = _appSettings.Value.SqlServerConnection;
            var concertDetails = await _concertsSqlServerService.GetArtistDetailsAsync(
                connectionstring, name);
            return Json(concertDetails);
        }

        [HttpGet()]
        [Route("api/getartist/{name}")]
        public async Task<IActionResult> GetArtist(string name)
        {

            var connectionstring = _appSettings.Value.SqlServerConnection;
            var concertDetails = await _concertsSqlServerService.GetArtistExistsAsync(
                connectionstring, name);
            return Json(concertDetails);
        }

        [HttpGet]
        [Route("api/getconcerts")]
        public async Task<IActionResult> GetConcerts()
        {
            var concertDetails = await _concertsSqlServerService.GetAllConcertDetailsAsync();

            return Json(concertDetails);
        }
        [HttpGet]
        [Route("api/getjwt")]
        public IActionResult GetJWTMusicApi()
        {
            var clientId = "6f51b20a-5090-4553-9a14-a8cdb0b1c484";
            var clientSecret = "09d4f073-088d-4817-a63e-134f407190a5";

            // Your JWT payload
            var payload = new JwtPayload
            {
                { "iss", clientId },
                { "exp", DateTimeOffset.UtcNow.AddMinutes(60).ToUnixTimeSeconds() } // Adjust the expiration time as needed
            };

            // Your JWT header
            var header = new JwtHeader
            {
                { "typ", "JWT" },
                { "alg", "ES256" },
                { "kid", "YOUR_PUBLIC_KEY_ID" } // Replace with your public key ID
            };

            // Create the JWT token
            var token = new JwtSecurityToken(header, payload);
            var tokenHandler = new JwtSecurityTokenHandler();

            // Serialize the token to a string
            string jwtToken = tokenHandler.WriteToken(token);

            // Encode your credentials in base64
            var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}"));
            var combinedAuth = $"{credentials} Bearer {jwtToken}";
            var result = new
            {
                Token = combinedAuth
            };

            // Return the JSON object
            return Ok(result);


        }

        [HttpGet]
        [Route("api/search/{query}")]
        public async Task<IActionResult> Search(string query)
        {
            var connectionstring = _appSettings.Value.SqlServerConnection;
            var searchResults = await _concertsSqlServerService.SearchArtistAsync(connectionstring, query);
            return Json(searchResults);
        }


        [HttpPost]
        [Route("api/postusers")]
        public async Task<IActionResult> PostUsers([FromBody] UserModel user)
        {
            var connectionstring = _appSettings.Value.SqlServerConnection;
            var userResult = await _concertsSqlServerService.PostUserAsync(connectionstring, user);

            return Json(userResult);
        }
    }
}
