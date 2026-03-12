using Entities.Enums;

namespace Operations.Models
{
    public class OperativeResult<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public List<string> Errors { get; set; }

        public OperativeResult() { }

        public OperativeResult(Enum error)
        {
            Success = false;
            Message = EnumHelper.GetDescription(error);
            Data = default;
            Errors = new List<string> { error.ToString() };
        }
    }
}
