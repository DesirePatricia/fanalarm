using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FanAlarm.Models.SQLServer;
using FanAlarm.Services.Interfaces;
using FanAlarm.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using FanAlarm.Models;

namespace FanAlarm.Services.Implementations
{
    public class ConcertsSqlServerService : IConcertsSqlServerService
    {
        private readonly IConcertsSqlServerRepository _concertsSqlServerRepository;
        private readonly IOptions<AppSettingsModel> _appSettings;
        public ConcertsSqlServerService(
            IConcertsSqlServerRepository concertsSqlServerRepository,
            IOptions<AppSettingsModel> appSettings)
        {
            _appSettings = appSettings;
            _concertsSqlServerRepository = concertsSqlServerRepository;
        }
        public async Task<IList<ConcertDetailsSqlServer>> GetAllConcertDetailsAsync()
        {
            var connectionstring = _appSettings.Value.SqlServerConnection;
            var result = await _concertsSqlServerRepository.GetAllConcertDetailsAsync(connectionstring);

            return result;
        }

        public async Task<IList<ArtistsDetailsSqlServer>> GetArtistDetailsAsync(string stringConn, string concertName)
        {
            var result = await _concertsSqlServerRepository.GetArtistDetailsAsync(stringConn, concertName);

            return result;
        }
        public async Task<Boolean> GetArtistExistsAsync(string stringConn, string artistName)
        {
            var result = await _concertsSqlServerRepository.GetArtistExistsAsync(stringConn, artistName);

            return result;
        }

        public async Task<Boolean> PostUserAsync(string stringConn, UserModel user)
        {
            List<int> ArtistIdsFinal = new List<int>();
            if(user.Email != null && user.Email != String.Empty)
            {
                var emailId = await _concertsSqlServerRepository.GetEmailExistsAsync(stringConn, user.Email);
                if(emailId == -1)
                {
                    emailId = await _concertsSqlServerRepository.AddEmailAsync(stringConn, user.Email, user.Latitude, user.Longitude);
                }
                foreach(ArtistDataModel artists in user.ArtistData)
                {
                    int artistId = await _concertsSqlServerRepository.GetArtistExistsIdAsync(stringConn, artists.Name);
                    if(artistId != -1)
                    {
                        ArtistIdsFinal.Add(artistId);
                    }
                    else
                    {
                        int artistIdNew = await _concertsSqlServerRepository.AddArtistAsync(stringConn, artists.Name);
                        ArtistIdsFinal.Add(artistIdNew);
                    }

                }
                var result = await _concertsSqlServerRepository.AddArtistsEmailAsync(stringConn, ArtistIdsFinal, emailId);
                return result;
            }
            if(user.Number != null && user.Number != String.Empty)
            {
                var numberId = await _concertsSqlServerRepository.GetNumberExistsAsync(stringConn, user.Number);
                if (numberId == -1)
                {
                    numberId = await _concertsSqlServerRepository.AddNumberAsync(stringConn, user.Number, user.Latitude, user.Longitude);
                }
                foreach (ArtistDataModel artists in user.ArtistData)
                {
                    int artistId = await _concertsSqlServerRepository.GetArtistExistsIdAsync(stringConn, artists.Name);
                    if (artistId != -1)
                    {
                        ArtistIdsFinal.Add(artistId);
                    }
                    else
                    {
                        artistId = await _concertsSqlServerRepository.AddArtistAsync(stringConn, artists.Name);
                        ArtistIdsFinal.Add(artistId);
                    }

                }
                var result = await _concertsSqlServerRepository.AddArtistsNumberAsync(stringConn, ArtistIdsFinal, numberId);
                return result;

            }
            else
            {

                return false;
            }

        }
    }
}
