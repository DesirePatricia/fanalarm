using System;
using System.Collections.Generic;

namespace FanAlarm.Models
{
    public class ArtistModel
    {
        public string Name { get; set; }
        public List<string> ExternalUrls { get; set; }
        public List<string> Images { get; set; }
    }
}
