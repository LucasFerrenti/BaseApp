using System.ComponentModel;
using System.Reflection;

namespace Entities.Enums
{
    public class EnumHelper
    {
        public static List<string> GetListOfDescription<T>() where T : struct
        {
            Type t = typeof(T);
            return !t.IsEnum ? null : System.Enum.GetValues(t).Cast<System.Enum>().Select(x => GetDescription(x)).ToList();
        }

        public static string GetDescription(System.Enum value)
        {
            return
                value
                    .GetType()
                    .GetMember(value.ToString())
                    .FirstOrDefault()
                    ?.GetCustomAttribute<DescriptionAttribute>()
                    ?.Description
                ?? value.ToString();
        }

        public static List<Tuple<int, string>> GetValueList<T>() where T : struct
        {
            Type t = typeof(T);
            return !t.IsEnum ? null : System.Enum.GetValues(t).Cast<System.Enum>().Select(x => new Tuple<int, string>(Convert.ToInt32(x), GetDescription(x))).ToList();
        }
    }
}
