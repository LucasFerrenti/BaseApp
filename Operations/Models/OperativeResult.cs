using Entities.Enums;

namespace Operations.Models
{
    public class OperativeResult<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public IEnumerable<string> Errors { get; set; }

        public OperativeResult() { }

        public OperativeResult(UserError error)
        {
            Success = false;
            Message = EnumHelper.GetDescription(error);
            Data = default;
            Errors = new List<string> { error.ToString() };
        }
    }
}
