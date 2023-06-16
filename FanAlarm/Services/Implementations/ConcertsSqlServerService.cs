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

        public async Task<IList<ConcertDetailsSqlServer>> GetArtistDetailsAsync(string stringConn, string concertName)
        {
            var result = await _concertsSqlServerRepository.GetArtistDetailsAsync(stringConn, concertName);

            return result;
        }
    }
}
