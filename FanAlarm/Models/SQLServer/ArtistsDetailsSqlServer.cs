using System;
using System.Collections.Generic;
using FanAlarm.Models.SQLServer;
namespace FanAlarm.Models.SQLServer
{
    public class ArtistsDetailsSqlServer
    {
        public string Name { get; set; }
        public string ArtistId { get; set; }
        public string Image { get; set; }
        public ConcertDetailsSqlServer Concerts { get; set; }
        public List<VenueDetailsSqlServer> Venues { get; set; }
    }
}
