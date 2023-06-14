using System;
using FanAlarm.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using FanAlarm.Models;
using FanAlarm.Models.SQLServer;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;

namespace FanAlarm.Repositories.Implementations
{
    public class ConcertsSqlServerRepository :IConcertsSqlServerRepository
    {
        private readonly string _configConnectionString;
        private readonly int _commandTimeOut = 90;
        public ConcertsSqlServerRepository(IOptions<AppSettingsModel> appSetting)
        {
            _configConnectionString = appSetting.Value.SqlServerConnection;
        }
        public async Task<IList<ConcertDetailsSqlServer>> GetAllConcertDetailsAsync(string stringConn)
        {

            try
            {
                var concertDetailsSqlServerList = new List<ConcertDetailsSqlServer>();
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "SELECT * " +
                                     "FROM concerts " +
                                     "JOIN attractions_concerts ON concerts.concerts_id = attractions_concerts.concerts_id " +
                                     "JOIN attractions ON attractions_concerts.attractions_id = attractions.attractions_id " +
                                     "JOIN venues ON venues.venues_id = concerts.concerts_id " +
                                     "JOIN sales ON sales.concert_id = concerts.concerts_id " +
                                     "LIMIT 20;";

                    var cmd = new MySqlCommand(commandStr, connection);
                    if (connection.State == ConnectionState.Closed)
                    {
                        connection.Open();
                    }
                    cmd.CommandTimeout = _commandTimeOut;
                    var dataReader = await cmd.ExecuteReaderAsync();
                    var artists = new List<ArtistsDetailsSqlServer>();
                    var venues = new List<VenueDetailsSqlServer>();
                    var sales = new List<SalesDetailsSqlServer>();

                    while (dataReader.Read())
                    {
                        artists.Add(new ArtistsDetailsSqlServer { Name = Convert.ToString(dataReader["attractions_name"]) });
                        venues.Add(new VenueDetailsSqlServer
                        {
                            Name = Convert.ToString(dataReader["venues_name"]),
                            Address = Convert.ToString(dataReader["address"]),
                            City = Convert.ToString(dataReader["city"]),
                            Country = Convert.ToString(dataReader["country"]),
                            State = Convert.ToString(dataReader["state"]),
                            Location = Convert.ToString(dataReader["location"])
                        });
                        var concertDetailsSqlServer = new ConcertDetailsSqlServer
                        {
                            Name = Convert.ToString(dataReader["concerts_name"]),
                            Url = Convert.ToString(dataReader["url"]),
                            Artists = artists,
                            Venues = venues,
                            Sales = sales

                        };
                        
                        if (concertDetailsSqlServerList.LastOrDefault() == null || (concertDetailsSqlServerList.LastOrDefault().Name != concertDetailsSqlServer.Name))
                        {
                            concertDetailsSqlServerList.Add(concertDetailsSqlServer);
                            artists = new List<ArtistsDetailsSqlServer>();
                            venues = new List<VenueDetailsSqlServer>();
                            sales = new List<SalesDetailsSqlServer>();

                        }

                    }

                    connection.Close();
                    return concertDetailsSqlServerList;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return null;
        }


    public async Task<ConcertDetailsSqlServer> GetConcertDetailsAsync(string stringConn, string concertName)
    {

        try
        {
            var concertDetailsSqlServer = new ConcertDetailsSqlServer();
            using (var connection = new MySqlConnection(stringConn))
            {
                    var commandStr = "SELECT * " +
                                     "FROM concerts " +
                                     "JOIN attractions_concerts ON concerts.concerts_id = attractions_concerts.concerts_id " +
                                     "JOIN attractions ON attractions_concerts.attractions_id = attractions.attractions_id " +
                                     "JOIN venues ON venues.venues_id = concerts.concerts_id " +
                                     "JOIN sales ON sales.concert_id = concerts.concerts_id "+
                                     "WHERE concerts.concerts_name = %s";

                    commandStr = String.Format(commandStr, concertName);
                    var cmd = new MySqlCommand(commandStr, connection);

                connection.Open();
                cmd.CommandTimeout = _commandTimeOut;
                var dataReader = await cmd.ExecuteReaderAsync();
                var artists = new List<ArtistsDetailsSqlServer>();
                var venues = new List<VenueDetailsSqlServer>();
                var sales = new List<SalesDetailsSqlServer>();

                while (dataReader.Read())
                {

                        artists.Add(new ArtistsDetailsSqlServer { Name = Convert.ToString(dataReader["attractions_name"])});
                        venues.Add(new VenueDetailsSqlServer
                        {
                            Name = Convert.ToString(dataReader["venues_name"]),
                            Address = Convert.ToString(dataReader["address"]),
                            City = Convert.ToString(dataReader["city"]),
                            Country = Convert.ToString(dataReader["country"]),
                            State = Convert.ToString(dataReader["state"]),
                            Location = Convert.ToString(dataReader["location"])
                        });
                    concertDetailsSqlServer = new ConcertDetailsSqlServer
                    {
                        Name = Convert.ToString(dataReader["concerts_name"]),
                        Url = Convert.ToString(dataReader["url"]),
                        Artists = artists,
                        Venues = venues,
                        Sales = sales

                    };
                }

                connection.Close();
                return concertDetailsSqlServer;
            }
        }
        catch (Exception ex)
        {
        }

        return null;
    }
}
}

