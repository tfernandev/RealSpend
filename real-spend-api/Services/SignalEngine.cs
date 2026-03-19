using RealSpend.Api.Models;

namespace RealSpend.Api.Services
{
    public interface ISignalEngine
    {
        RealSignal CalculateRealSignal(decimal nominalAmount, double ipcCurrent, double ipcBase);
    }

    public record RealSignal(decimal Nominal, decimal Real, double PurchasingPowerChange);

    public class SignalEngine : ISignalEngine
    {
        public RealSignal CalculateRealSignal(decimal nominalAmount, double ipcCurrent, double ipcBase)
        {
            if (ipcCurrent <= 0 || ipcBase <= 0) return new RealSignal(nominalAmount, nominalAmount, 0);

            // Real = Nominal * (IPC Base / IPC Current)
            decimal realAmount = decimal.Round(nominalAmount * (decimal)(ipcBase / ipcCurrent), 2);
            
            // Purchasing Power Change = ((IPC Current / IPC Base) - 1) * 100
            double ppChange = Math.Round(((ipcCurrent / ipcBase) - 1) * 100, 2);

            return new RealSignal(nominalAmount, realAmount, ppChange);
        }
    }
}
