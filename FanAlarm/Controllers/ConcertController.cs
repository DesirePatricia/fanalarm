using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FanAlarm.Models;
using FanAlarm.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Text.Json;
using Newtonsoft.Json;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FanAlarm.Controllers
{
    public class ConcertController : Controller
    {
        private readonly IOptions<AppSettingsModel> _appSettings;
        private readonly IConcertsSqlServerService _concertsSqlServerService;

        public ConcertController(IOptions<AppSettingsModel> appSettings, IConcertsSqlServerService concertsSqlServerService)
        {
            _appSettings = appSettings;
            _concertsSqlServerService = concertsSqlServerService;

        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpGet()]
        [Route("api/getconcert/{name}")]
        public async Task<IActionResult> GetConcert(string name)
        {

            var connectionstring = _appSettings.Value.SqlServerConnection;
            var concertDetails = await _concertsSqlServerService.GetArtistDetailsAsync(
                connectionstring, name);
            return Json(concertDetails);
        }

        [HttpGet]
        [Route("api/getconcerts")]
        public async Task<IActionResult> GetConcerts()
        {
            var concertDetails = await _concertsSqlServerService.GetAllConcertDetailsAsync();

            return Json(concertDetails);
        }
    }
}
