using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Entities.Enums
{
    public enum GlobalError
    {
        [Description("Error inesperado")]
        UNEXPECTED_ERROR,
        [Description("Datos invalidos")]
        INVALID_DATA,
    }
}