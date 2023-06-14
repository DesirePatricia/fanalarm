using System;
using System.Collections.Generic;
using FanAlarm.Models.SQLServer;
namespace FanAlarm.Models.SQLServer
{
    public class ConcertDetailsSqlServer
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public List<SalesDetailsSqlServer> Sales { get; set; }
        public List<VenueDetailsSqlServer> Venues { get; set; }
        public List<ArtistsDetailsSqlServer> Artists { get; set; }

    }
}
