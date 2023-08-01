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
        Task<Boolean> GetArtistExistsAsync(string stringConn, string artistName);
        Task<int> GetArtistExistsIdAsync(string stringConn, string artistName);
        Task<int> GetEmailExistsAsync(string stringConn, string email);
        Task<int> GetNumberExistsAsync(string stringConn, string number);
        Task<int> AddArtistAsync(string stringConn, string artistName);
        Task<List<int>> AddArtistsAsync(string stringConn, List<string> artistName);
        Task<int> AddNumberAsync(string stringConn, string number, string latitude, string longitude);
        Task<int> AddEmailAsync(string stringConn, string email, string latitude, string longitude);
        Task<Boolean> AddArtistEmailAsync(string stringConn, int artistId, int emailId);
        Task<Boolean> AddArtistsEmailAsync(string stringConn, List<int> artistIds, int emailId);
        Task<int> AddArtistNumberAsync(string stringConn, int artistId, int numberId);
        Task<Boolean> AddArtistsNumberAsync(string stringConn, List<int> artistIds, int numberId);

    }
}
