import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import {
  makeEmailRules,
  makePasswordRules,
} from "../../validations/validation.rule";
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore";
import googleIcon from "../../assets/google.svg";

interface LoginFormProps {
  onToggleMode: () => void;
}

interface LoginInputs {
  email: string;
  password: string;
}

const config = {
  development: {
    callBackUrl: "http://localhost:8000/api/v1/auth/redirect",
    apiUrl: "http://localhost:8000",
  },
  production: {
    callBackUrl: import.meta.env.VITE_CALLBACK_URL || "",
    apiUrl: import.meta.env.VITE_API_PROD || "",
  },
};

const getCallbackUrl = () => {
  const isDev = process.env.NODE_ENV == "development";
  const currentConfig = isDev ? config.development : config.production;
  return currentConfig.callBackUrl;
};

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();

  const onSubmit: SubmitHandler<LoginInputs> = async (data: LoginInputs) => {
    try {
      await login(data);
    } catch (err) {
      return;
    }
  };

  const handleGoogleLogin = () => {
    try {
      const callbackUrl = getCallbackUrl();
      if (!callbackUrl) {
        console.error("Callback URL is not configure");
        return;
      }
      window.location.href = callbackUrl;
    } catch (error) {
      return;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your FinaryFlow account</p>
        <div className="mt-3">
          <Button
            size="large"
            variant="outlined"
            fullWidth
            onClick={handleGoogleLogin}
          >
            <img src={googleIcon} alt="" className="h-6 w-6 mr-1" />
            Continue with Google
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {/* Email */}
        <TextField
          id="email"
          label="Email Address"
          placeholder="finaryflow@gmail.com"
          type="email"
          variant="outlined"
          fullWidth
          {...register("email", makeEmailRules<LoginInputs, "email">())}
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail size={20} style={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Password */}
        <TextField
          id="password"
          label="Password"
          placeholder="********"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          {...register(
            "password",
            makePasswordRules<LoginInputs, "password">()
          )}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock size={20} style={{ color: "gray" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Remember me & Forgot password */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={<Checkbox color="primary" />}
            tabIndex={-1}
            label="Remember me"
          />
          <Button variant="text" size="small" color="primary" tabIndex={-1}>
            Forgot password?
          </Button>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?
          <Button size="large" color="info" onClick={onToggleMode}>
            Sign up
          </Button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
