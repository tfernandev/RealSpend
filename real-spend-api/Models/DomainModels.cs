using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealSpend.Api.Models
{
    public class IpcIndex
    {
        [Key]
        public string Period { get; set; } = string.Empty; // YYYY-MM
        public double Value { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class BudgetVersion
    {
        [Key]
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public string RowsHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public ICollection<BudgetEntry> Entries { get; set; } = new List<BudgetEntry>();
    }

    public class BudgetEntry
    {
        [Key]
        public int Id { get; set; }
        public int BudgetVersionId { get; set; }
        public string ProgramId { get; set; } = string.Empty;
        public string ProgramName { get; set; } = string.Empty;
        public string Period { get; set; } = string.Empty; // YYYY-MM
        public decimal NominalAmount { get; set; }
        
        [ForeignKey("BudgetVersionId")]
        public BudgetVersion Version { get; set; } = null!;
    }

    public enum EventType { InflationUpdate, BudgetExecution, HistoricalCorrection }

    public class EventLog
    {
        [Key]
        public int Id { get; set; }
        public EventType Type { get; set; }
        public string Summary { get; set; } = string.Empty;
        public string PayloadJson { get; set; } = "{}";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
