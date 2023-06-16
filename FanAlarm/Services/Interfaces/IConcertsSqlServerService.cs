﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FanAlarm.Models.SQLServer;

namespace FanAlarm.Services.Interfaces
{
    public interface IConcertsSqlServerService
    {
        Task<IList<ConcertDetailsSqlServer>> GetAllConcertDetailsAsync();
        Task<IList<ConcertDetailsSqlServer>> GetArtistDetailsAsync(string stringConn, string concertName);
    }
}
