using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FanAlarm.Models.SQLServer;

namespace FanAlarm.Services.Interfaces
{
    public interface IConcertsSqlServerService
    {
        Task<IList<ConcertDetailsSqlServer>> GetAllConcertDetailsAsync();
        Task<ConcertDetailsSqlServer> GetConcertDetailsAsync(string stringConn, string concertName);
    }
}
