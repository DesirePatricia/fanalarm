using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using FanAlarm.Models.SQLServer;

namespace FanAlarm.Repositories.Interfaces
{
    public interface IConcertsSqlServerRepository
    {
        Task<IList<ConcertDetailsSqlServer>> GetAllConcertDetailsAsync(string stringConn);
        Task<IList<ArtistsDetailsSqlServer>> GetArtistDetailsAsync(string stringConn, string concertName);
    }
}
