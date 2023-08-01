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
    public class ConcertsSqlServerRepository : IConcertsSqlServerRepository
    {
        private readonly string _configConnectionString;
        private readonly int _commandTimeOut = 90;
        private ArtistsDetailsSqlServer artistDetailsSqlServer;

        public ConcertsSqlServerRepository(IOptions<AppSettingsModel> appSetting)
        {
            _configConnectionString = appSetting.Value.SqlServerConnection;
        }

        public async Task<int> AddArtistAsync(string stringConn, string artistName)
        {
            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "INSERT INTO attractions (attractions_name) VALUES (@artistName)";
                    var cmd = new MySqlCommand(commandStr, connection);
                    cmd.Parameters.AddWithValue("@artistName", artistName);

                    if (connection.State == ConnectionState.Closed)
                    {
                        await connection.OpenAsync();
                    }

                    cmd.CommandTimeout = _commandTimeOut;
                    await cmd.ExecuteNonQueryAsync();
                    var artistExists = (int)cmd.LastInsertedId;

                    return artistExists;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return -1;
        }


        public async Task<List<int>> AddArtistsAsync(string stringConn, List<string> artistNames)
        {
            List<int> insertedArtistIds = new List<int>();

            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "INSERT INTO attractions (attractions_name) VALUES (@artistName)";
                    var cmd = new MySqlCommand(commandStr, connection);

                    if (connection.State == ConnectionState.Closed)
                    {
                        await connection.OpenAsync();
                    }

                    foreach (string artistName in artistNames)
                    {
                        cmd.Parameters.Clear(); // Clear previous parameters
                        cmd.Parameters.AddWithValue("@artistName", artistName);

                        await cmd.ExecuteNonQueryAsync();

                        // Retrieve the last inserted ID
                        var lastInsertedId = (int)cmd.LastInsertedId;
                        insertedArtistIds.Add(lastInsertedId);
                    }

                    return insertedArtistIds;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return null; // Return null to indicate failure
        }



        public async Task<bool> AddArtistEmailAsync(string stringConn, int artistId, int emailId)
        {
            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "INSERT INTO attractions_emails (artists_id, emails_id) VALUES (@artistId, @emailId)";
                    var cmd = new MySqlCommand(commandStr, connection);
                    cmd.Parameters.AddWithValue("@artistId", artistId);
                    cmd.Parameters.AddWithValue("@emailId", emailId);

                    if (connection.State == ConnectionState.Closed)
                    {
                        await connection.OpenAsync();
                    }

                    cmd.CommandTimeout = _commandTimeOut;
                    var rowsAffected = await cmd.ExecuteNonQueryAsync();
                    var emailExists = rowsAffected > 0;

                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return false;
        }

        public async Task<bool> AddArtistsEmailAsync(string stringConn, List<int> artistIds, int emailId)
        {
            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "INSERT INTO attractions_emails (attractions_id, emails_id) VALUES (@artistId, @emailId)";
                    var cmd = new MySqlCommand(commandStr, connection);
                    

                    foreach (int artistId in artistIds)
                    {
                        cmd.Parameters.Clear(); // Clear previous parameters before adding new ones

                        cmd.Parameters.AddWithValue("@artistId", artistId);
                        cmd.Parameters.AddWithValue("@emailId", emailId);

                        if (connection.State == ConnectionState.Closed)
                        {
                            await connection.OpenAsync();
                        }

                        await cmd.ExecuteNonQueryAsync();
                    }


                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return false;
        }

        public async Task<int> AddArtistNumberAsync(string stringConn, int artistId, int numberId)
        {
            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "INSERT INTO attractions_numbers (attractions_id, numbers_id) VALUES (@artistId, @numberId)";
                    var cmd = new MySqlCommand(commandStr, connection);
                    cmd.Parameters.AddWithValue("@artistId", artistId);
                    cmd.Parameters.AddWithValue("@numberId", numberId);

                    if (connection.State == ConnectionState.Closed)
                    {
                        await connection.OpenAsync();
                    }

                    cmd.CommandTimeout = _commandTimeOut;
                    await cmd.ExecuteNonQueryAsync();
                    int lastInsertedId = (int)cmd.LastInsertedId;

                    return lastInsertedId;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return -1;
        }

        public async Task<bool> AddArtistsNumberAsync(string stringConn, List<int> artistIds, int numberId)
        {
            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "INSERT INTO attractions_numbers (attractions_id, numbers_id) VALUES (@artistId, @numberId)";
                    var cmd = new MySqlCommand(commandStr, connection);

                    foreach(int artistId in artistIds)
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@artistId", artistId);
                        cmd.Parameters.AddWithValue("@numberId", numberId);

                        if (connection.State == ConnectionState.Closed)
                        {
                            await connection.OpenAsync();
                        }

                        await cmd.ExecuteNonQueryAsync();

                    }

                   

                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return false;
        }

        public async Task<int> AddEmailAsync(string stringConn, string email, string latitude, string longitude)
        {
            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "INSERT INTO emails (email, email_lat, email_long) VALUES (@emailName, @latitude, @longitude)";
                    var cmd = new MySqlCommand(commandStr, connection);
                    cmd.Parameters.AddWithValue("@emailName", email);
                    cmd.Parameters.AddWithValue("@latitude", latitude);
                    cmd.Parameters.AddWithValue("@longitude", longitude);

                    if (connection.State == ConnectionState.Closed)
                    {
                        await connection.OpenAsync();
                    }

                    cmd.CommandTimeout = _commandTimeOut;
                    var rowsAffected = await cmd.ExecuteNonQueryAsync();
                    var emailExists = rowsAffected > 0;
                    int lastInsertedId = (int)cmd.LastInsertedId;

                    return lastInsertedId;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return -1;
        }

        public async Task<int> AddNumberAsync(string stringConn, string number, string latitude, string longitude)
        {
            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "INSERT INTO numbers (number, number_lat, number_long) VALUES (@number, @latitude, @longitude)";
                    var cmd = new MySqlCommand(commandStr, connection);
                    cmd.Parameters.AddWithValue("@number", number);
                    cmd.Parameters.AddWithValue("@latitude", latitude);
                    cmd.Parameters.AddWithValue("@longitude", longitude);

                    if (connection.State == ConnectionState.Closed)
                    {
                        await connection.OpenAsync();
                    }

                    cmd.CommandTimeout = _commandTimeOut;
                    await cmd.ExecuteNonQueryAsync();
                    int lastInsertedId = (int)cmd.LastInsertedId;

                    return lastInsertedId;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return -1;
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
                        artists.Add(new ArtistsDetailsSqlServer
                        { Name = Convert.ToString(dataReader["attractions_name"]) });
                        venues.Add(new VenueDetailsSqlServer
                        {
                            Name = Convert.ToString(dataReader["venues_name"]),
                            Address = Convert.ToString(dataReader["address"]),
                            City = Convert.ToString(dataReader["city"]),
                            Country = Convert.ToString(dataReader["country"]),
                            State = Convert.ToString(dataReader["state"]),
                            Location = Convert.ToString(dataReader["location"]),
                            Url = Convert.ToString(dataReader["url"]),
                        });
                        var concertDetailsSqlServer = new ConcertDetailsSqlServer
                        {
                            Name = Convert.ToString(dataReader["concerts_name"]),

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


        public async Task<IList<ArtistsDetailsSqlServer>> GetArtistDetailsAsync(string stringConn, string concertName)
        {

            try
            {
                var artistDetailsSqlServerList = new List<ArtistsDetailsSqlServer>();
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "SELECT DISTINCT * " +
                                     "FROM attractions " +
                                     "JOIN attractions_concerts ON attractions.attractions_id = attractions_concerts.attractions_id " +
                                     "JOIN concerts ON attractions_concerts.concerts_id = concerts.concerts_id " +
                                     "JOIN venues ON venues.venues_id = concerts.venue_id " +
                                     "WHERE attractions.attractions_name = '{0}'";

                    commandStr = String.Format(commandStr, concertName);
                    var cmd = new MySqlCommand(commandStr, connection);

                    if (connection.State == ConnectionState.Closed)
                    {
                        connection.Open();
                    }
                    cmd.CommandTimeout = _commandTimeOut;
                    var dataReader = await cmd.ExecuteReaderAsync();
                    var venues = new List<VenueDetailsSqlServer>();
                    var concerts = new ConcertDetailsSqlServer();

                    while (dataReader.Read())
                    {
                        venues.Add(new VenueDetailsSqlServer
                        {
                            Name = Convert.ToString(dataReader["venues_name"]),
                            Address = Convert.ToString(dataReader["address"]),
                            City = Convert.ToString(dataReader["city"]),
                            Country = Convert.ToString(dataReader["country"]),
                            State = Convert.ToString(dataReader["state"]),
                            Location = Convert.ToString(dataReader["location"]),
                            Date = Convert.ToDateTime(dataReader["concerts_date"]),
                            Url = Convert.ToString(dataReader["url"]),
                        });
                        concerts = new ConcertDetailsSqlServer
                        {
                            Name = Convert.ToString(dataReader["concerts_name"]),

                        };
                        var artists = new ArtistsDetailsSqlServer
                        {
                            Name = Convert.ToString(dataReader["attractions_name"]),
                            ArtistId = Convert.ToString(dataReader["attractions_id"]),
                            Image = Convert.ToString(dataReader["attractions_image"]),
                            Venues = venues,
                            Concerts = concerts,

                        };

                        if (artistDetailsSqlServerList.LastOrDefault() == null || (artistDetailsSqlServerList.LastOrDefault().Name != artists.Name))
                        {
                            artistDetailsSqlServerList.Add(artists);

                        }

                    }

                    connection.Close();
                    return artistDetailsSqlServerList;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return null;
        }
        public async Task<Boolean> GetArtistExistsAsync(string stringConn, string artistName)
        {

            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "SELECT DISTINCT * " +
                                     "FROM attractions " +
                                     "WHERE attractions.attractions_name = @artistName";

                    commandStr = String.Format(commandStr, artistName);
                    var cmd = new MySqlCommand(commandStr, connection);
                    cmd.Parameters.AddWithValue("@artistName", artistName);


                    if (connection.State == ConnectionState.Closed)
                    {
                        connection.Open();
                    }
                    cmd.CommandTimeout = _commandTimeOut;
                    var dataReader = await cmd.ExecuteReaderAsync();

                    var artistExists = false;
                    var attractions_name = String.Empty;

                    while (dataReader.Read())
                    {

                        attractions_name = Convert.ToString(dataReader["attractions_name"]);

                    }

                    if (attractions_name != null && attractions_name != String.Empty)
                    {
                        artistExists = true;
                    }



                    connection.Close();
                    return artistExists;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return false;
        }
        public async Task<int> GetArtistExistsIdAsync(string stringConn, string artistName)
        {

            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "SELECT DISTINCT * " +
                                     "FROM attractions " +
                                     "WHERE attractions.attractions_name = @artistName";

                    commandStr = String.Format(commandStr, artistName);
                    var cmd = new MySqlCommand(commandStr, connection);
                    cmd.Parameters.AddWithValue("@artistName", artistName);

                    if (connection.State == ConnectionState.Closed)
                    {
                        connection.Open();
                    }
                    cmd.CommandTimeout = _commandTimeOut;
                    var dataReader = await cmd.ExecuteReaderAsync();
                    var attractions_name = String.Empty;
                    int attractions_id = -1;

                    while (dataReader.Read())
                    {

                        attractions_name = Convert.ToString(dataReader["attractions_name"]);

                    }

                    if (attractions_name != null && attractions_name != String.Empty)
                    {
                        attractions_id = Convert.ToInt32(dataReader["attractions_id"]);
                    }



                    connection.Close();
                    return attractions_id;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return -1;
        }
        public async Task<int> GetEmailExistsAsync(string stringConn, string email)
        {
            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "SELECT DISTINCT * " +
                                     "FROM emails " +
                                     "WHERE emails.email = '{0}'";

                    commandStr = String.Format(commandStr, email);
                    var cmd = new MySqlCommand(commandStr, connection);

                    if (connection.State == ConnectionState.Closed)
                    {
                        connection.Open();
                    }
                    cmd.CommandTimeout = _commandTimeOut;
                    var dataReader = await cmd.ExecuteReaderAsync();
                    var email_name = String.Empty;
                    int email_id = -1;

                    while (dataReader.Read())
                    {

                        email_name = Convert.ToString(dataReader["email"]);

                    }

                    if (email_name != null && email_name != String.Empty)
                    {
                        email_id = Convert.ToInt32(dataReader["email_id"]);
                    }



                    connection.Close();
                    return email_id;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return -1;
        }

        public async Task<int> GetNumberExistsAsync(string stringConn, string number)
        {
            try
            {
                using (var connection = new MySqlConnection(stringConn))
                {
                    var commandStr = "SELECT DISTINCT * " +
                                     "FROM numbers " +
                                     "WHERE numbers.number = '{0}'";

                    commandStr = String.Format(commandStr, number);
                    var cmd = new MySqlCommand(commandStr, connection);

                    if (connection.State == ConnectionState.Closed)
                    {
                        connection.Open();
                    }
                    cmd.CommandTimeout = _commandTimeOut;
                    var dataReader = await cmd.ExecuteReaderAsync();
                    var number_name = String.Empty;
                    int number_id = -1;

                    while (dataReader.Read())
                    {

                        number_name = Convert.ToString(dataReader["number"]);

                    }

                    if (number_name != null && number_name != String.Empty)
                    {
                        number_id = Convert.ToInt32(dataReader["number_id"]);
                    }



                    connection.Close();
                    return number_id;
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex);
            }

            return -1;
        }

    }
}





