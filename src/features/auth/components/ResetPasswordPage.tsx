import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, GraduationCap, AlertCircle, CheckCircle, ChevronLeft, ShieldCheck } from "lucide-react";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setValidSession(false);
          return;
        }
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get("type");
        
        if (session && (type === "recovery" || session)) {
          setValidSession(true);
        } else {
          setValidSession(false);
        }
      } catch (err) {
        setValidSession(false);
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords Don't Match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password Updated!", description: "Please sign in with your new password." });
      await supabase.auth.signOut();
      navigate("/auth?reset=success");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-slate-500 font-medium animate-pulse">Verifying security session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-12">
      {/* The "Open Book" Container */}
      <div className="flex w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-h-[650px] flex-col md:flex-row border border-slate-100">
        
        {/* LEFT SIDE: Visual Branding (Security Focused) */}
        <div className="w-full md:w-[45%] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-12 -mb-12 blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-white mb-12">
              <div className="p-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">Test Crack</span>
            </div>
            
            <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.15]">
                  Secure Your Learning.
                </h2>
                <p className="text-purple-100/80 text-lg leading-relaxed max-w-xs">
                  One last step to regain access to your personalized study dashboard.
                </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/90 text-xs font-medium uppercase tracking-wider">
               <ShieldCheck className="h-4 w-4" /> Account Recovery
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: The Form */}
        <div className="w-full md:w-[55%] p-8 md:p-20 flex flex-col justify-center bg-white">
          
          {!validSession ? (
            /* INVALID SESSION VIEW */
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
              <div className="mx-auto w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Link Expired</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">
                  For your security, reset links are only valid for a short time. Please request a new one.
                </p>
              </div>
              <Button 
                onClick={() => navigate("/auth")} 
                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl"
              >
                Return to Sign In
              </Button>
            </div>
          ) : (
            /* RESET FORM VIEW */
            <>
              <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                  Set New Password
                </h3>
                <p className="text-slate-500 font-medium">
                  Create a strong password that you don't use elsewhere.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-7 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* New Password */}
                <div className="space-y-2.5">
                  <Label className="text-slate-700 font-bold text-sm ml-1">New Password</Label>
                  <div className="relative group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="h-13 bg-slate-50/50 border-slate-200 pr-12 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 rounded-2xl transition-all"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Confirm Password */}
                <div className="space-y-2.5">
                  <Label className="text-slate-700 font-bold text-sm ml-1">Confirm Password</Label>
                  <div className="relative group">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      className="h-13 bg-slate-50/50 border-slate-200 pr-12 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 rounded-2xl transition-all"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Match Indicator */}
                {confirmPassword && (
                  <div className={`flex items-center gap-2 text-sm font-bold animate-in fade-in zoom-in duration-300 ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                    {newPassword === confirmPassword ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    {newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-[0.98] mt-4"
                  disabled={loading || newPassword !== confirmPassword}
                >
                  {loading ? "Updating Security..." : "Confirm New Password"}
                </Button>
              </form>

              <div className="mt-12 text-center">
                <button
                  onClick={() => navigate("/auth")}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors group"
                >
                  <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Return to login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;