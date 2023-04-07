using System;
using System.Collections.Generic;

namespace FanAlarm.Models
{
    public class UserModel
    {
         public string User { get; set; }
         public string Password { get; set; }
         public List<String> TopArtists { get; set; } 
    }
}
