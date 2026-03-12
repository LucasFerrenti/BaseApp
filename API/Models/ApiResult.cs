using Entities.Enums;
using Operations.Models;

namespace API.Models
{
    public class ApiResult<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public List<string> Errors { get; set; }

        public ApiResult() { }

        public ApiResult(Enum error)
        {
            Success = false;
            Message = EnumHelper.GetDescription(error);
            Errors = new List<string> { error.ToString() };
        }
    }
}
