using Entities.Database;
using System;
using System.Collections.Generic;
using System.Text;

namespace Operations.Models
{
    public class LoginResult
    {
        public User User { get; set; }
        public string Token { get; set; }
    }
}
