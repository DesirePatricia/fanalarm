using System;
using System.Collections.Generic;

namespace FanAlarm.Models
{
    public class UserModel
    {
         public string Email { get; set; }
         public string Number { get; set; }
         public List<ArtistDataModel> ArtistData { get; set; } 
    }
}
