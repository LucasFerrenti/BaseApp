using System.ComponentModel;

namespace Entities.Enums
{
    public enum Role
    {
        [Description("Administrador")]
        Admin,

        [Description("Cliente")]
        Customer,

        [Description("Vendedor")]
        Seller
    }
}
