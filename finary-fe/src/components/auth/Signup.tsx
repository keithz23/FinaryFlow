import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import {
  makeConfirmPasswordRules,
  makeEmailRules,
  makeFullNameRules,
  makePasswordRules,
} from "../../validations/validation.rule";
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore";
import type { RegisterData } from "../../types/auth/auth";
import googleIcon from "../../assets/google.svg";

interface SignupFormProps {
  onToggleMode: () => void;
}

interface SignupInputs {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
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

const SignupForm: React.FC<SignupFormProps> = ({ onToggleMode }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignupInputs>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { signup, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    try {
      const payload: RegisterData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      };
      await signup(payload);
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
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h2>
        <p className="text-gray-600">
          Join FinaryFlow and take control of your finances
        </p>
        <div className="mt-3">
          <Button
            size="large"
            variant="outlined"
            color="success"
            fullWidth
            onClick={handleGoogleLogin}
          >
            <img src={googleIcon} alt="" className="h-6 w-6 mr-1" />
            Continue with Google
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <TextField
            id="fullName"
            label="Full name"
            placeholder="John Doe"
            type="text"
            variant="outlined"
            color="success"
            fullWidth
            {...register(
              "fullName",
              makeFullNameRules<SignupInputs, "fullName">()
            )}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <User size={20} style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div>
          <TextField
            id="email"
            label="Email Address"
            placeholder="finaryflow@gmail.com"
            type="email"
            variant="outlined"
            color="success"
            fullWidth
            {...register("email", makeEmailRules<SignupInputs, "email">())}
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
        </div>

        <div>
          <TextField
            id="password"
            label="Password"
            placeholder="********"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            color="success"
            fullWidth
            {...register(
              "password",
              makePasswordRules<SignupInputs, "password">()
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
        </div>

        <div>
          <TextField
            id="confirmPassword"
            label="Confirm password"
            placeholder="********"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            color="success"
            fullWidth
            {...register(
              "confirmPassword",
              makeConfirmPasswordRules<SignupInputs, "confirmPassword">(() =>
                getValues("password")
              )
            )}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="flex items-center">
          <FormControlLabel
            control={<Checkbox color="success" />}
            label={
              <Typography variant="body2" color="text.secondary">
                I agree to the{" "}
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  color="success.main"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  color="success.main"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            }
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          size="large"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? "Creating Account.." : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Button size="large" color="success" onClick={onToggleMode}>
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
