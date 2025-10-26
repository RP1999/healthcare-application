// frontend/src/pages/SigninPage.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  useBreakpointValue,
  Fade,
  ScaleFade,
  Image,
  useToken,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { request } from "../lib/api";
import { useAuth } from "../store/auth";

// You can replace this with your actual logo
const Logo = () => (
  <Box textAlign="center" mb={8}>
    <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, blue.500, purple.600)" bgClip="text">
      MediLink
    </Text>
    <Text fontSize="sm" color="gray.500" mt={1}>Healthcare Management</Text>
  </Box>
);

export default function SigninPage() {
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  const loginStore = useAuth((s) => s.login);
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Enhanced color scheme
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.100", "gray.700");
  const muted = useColorModeValue("gray.600", "gray.400");
  const shadow = useColorModeValue("xl", "dark-lg");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const [blue500] = useToken("colors", ["blue.500"]);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFocus = (field) => () => setIsFocused(f => ({ ...f, [field]: true }));
  const handleBlur = (field) => () => setIsFocused(f => ({ ...f, [field]: false }));

  const validate = () => {
    if (!form.email || !form.password) return "Please fill in both email and password.";
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!isEmail) return "Please enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    const v = validate();
    if (v) {
      setErrMsg(v);
      return;
    }
    try {
      setLoading(true);
      const res = await request.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      loginStore({ user: res.user, token: res.token });
      nav(from, { replace: true });
    } catch (err) {
      setErrMsg(err.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="100%" p={0} minH="100vh">
      <Flex 
        direction={{ base: "column", lg: "row" }} 
        minH="100vh"
        align="center"
        justify="center"
        bg={useColorModeValue("gray.50", "gray.900")}
      >
        {/* Left Side - Brand Section with Gradient Background */}
        <ScaleFade in={true} initialScale={0.9}>
          <Flex
            flex="1"
            bgGradient="linear(to-br, blue.600, purple.700)"
            color="white"
            minH={{ base: "200px", lg: "100vh" }}
            w="100%"
            align="center"
            justify="center"
            position="relative"
            overflow="hidden"
          >
            {/* Background Pattern */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              opacity="0.1"
              bgImage="url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
            />
            
            <Box 
              textAlign="center" 
              p={8} 
              zIndex={1}
              maxW="500px"
            >
              <Fade in={true} delay={0.2}>
                <Logo />
                <Heading size="2xl" mb={6} fontWeight="bold">
                  Welcome Back
                </Heading>
                <Text fontSize="xl" opacity={0.9} lineHeight={1.6} mb={8}>
                  Continue your journey in healthcare excellence. Manage patients, appointments, and medical records seamlessly.
                </Text>
                
                {/* Feature Points */}
                <Stack spacing={4} textAlign="left" maxW="400px" mx="auto">
                  {["Secure patient management", "Real-time appointment scheduling", "Integrated billing system", "HIPAA compliant"].map((feature, index) => (
                    <Flex key={feature} align="center" opacity={0.9}>
                      <Box w="8px" h="8px" bg="white" borderRadius="full" mr={3} />
                      <Text>{feature}</Text>
                    </Flex>
                  ))}
                </Stack>
              </Fade>
            </Box>
          </Flex>
        </ScaleFade>

        {/* Right Side - Sign-in Form */}
        <Flex
          flex="1"
          align="center"
          justify="center"
          p={8}
        >
          <Fade in={true} delay={0.4}>
            <Box
              as="form"
              onSubmit={onSubmit}
              w="100%"
              maxW="450px"
              bg={cardBg}
              rounded="2xl"
              boxShadow={shadow}
              p={{ base: 6, md: 8 }}
              border="1px solid"
              borderColor={border}
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                bgGradient: "linear(to-r, blue.500, purple.600)",
                borderTopRadius: "2xl"
              }}
            >
              <Stack spacing={6}>
                {/* Header */}
                <Box textAlign="center">
                  <Heading size="lg" mb={2} fontWeight="700">
                    Sign In
                  </Heading>
                  <Text color={muted}>
                    Don't have an account?{" "}
                    <Link 
                      as={RouterLink} 
                      to="/signup" 
                      color={accentColor}
                      fontWeight="600"
                      _hover={{ textDecoration: "none", color: "blue.600" }}
                    >
                      Get started
                    </Link>
                  </Text>
                </Box>

                {/* Error Alert */}
                {errMsg ? (
                  <Alert status="error" rounded="lg" variant="left-accent">
                    <AlertIcon />
                    {errMsg}
                  </Alert>
                ) : null}

                {/* Email Field */}
                <FormControl isRequired>
                  <FormLabel fontWeight="600" fontSize="sm" mb={2}>
                    Email Address
                  </FormLabel>
                  <Input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={form.email}
                    onChange={onChange}
                    onFocus={handleFocus("email")}
                    onBlur={handleBlur("email")}
                    autoComplete="email"
                    size="lg"
                    rounded="lg"
                    borderColor={isFocused.email ? accentColor : "gray.300"}
                    focusBorderColor={accentColor}
                    _hover={{ borderColor: "gray.400" }}
                    transition="all 0.2s"
                  />
                </FormControl>

                {/* Password Field */}
                <FormControl isRequired>
                  <FormLabel fontWeight="600" fontSize="sm" mb={2}>
                    Password
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPw ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={onChange}
                      onFocus={handleFocus("password")}
                      onBlur={handleBlur("password")}
                      autoComplete="current-password"
                      rounded="lg"
                      borderColor={isFocused.password ? accentColor : "gray.300"}
                      focusBorderColor={accentColor}
                      _hover={{ borderColor: "gray.400" }}
                      transition="all 0.2s"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPw ? "Hide password" : "Show password"}
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPw((s) => !s)}
                        icon={showPw ? <ViewOffIcon /> : <ViewIcon />}
                        color="gray.500"
                        _hover={{ bg: "transparent", color: accentColor }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {/* Remember Me & Forgot Password */}
                <Flex align="center" justify="space-between">
                  <Checkbox
                    name="remember"
                    isChecked={form.remember}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, remember: e.target.checked }))
                    }
                    colorScheme="blue"
                    size="lg"
                  >
                    <Text fontSize="sm">Remember me</Text>
                  </Checkbox>
                  <Link 
                    as={RouterLink} 
                    to="#" 
                    color={accentColor}
                    fontSize="sm"
                    fontWeight="600"
                    _hover={{ textDecoration: "none", color: "blue.600" }}
                  >
                    Forgot password?
                  </Link>
                </Flex>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  height="50px"
                  isLoading={loading}
                  loadingText="Signing in..."
                  bgGradient="linear(to-r, blue.500, purple.600)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.600, purple.700)",
                    transform: "translateY(-2px)",
                    boxShadow: "lg"
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  transition="all 0.2s"
                  rounded="lg"
                  fontWeight="bold"
                  fontSize="md"
                >
                  Sign In
                </Button>

                {/* Divider */}
                <Flex align="center" my={4}>
                  <Divider />
                  <Text px={3} color={muted} fontSize="sm" whiteSpace="nowrap">
                    Or continue with
                  </Text>
                  <Divider />
                </Flex>

                {/* Social Sign-in (Optional) */}
                <Button
                  variant="outline"
                  size="lg"
                  height="50px"
                  rounded="lg"
                  leftIcon={
                    <Box w="5" h="5">
                      <svg viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </Box>
                  }
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "md"
                  }}
                  transition="all 0.2s"
                >
                  Continue with Google
                </Button>

                {/* Footer */}
                <Text color={muted} fontSize="xs" textAlign="center" pt={4}>
                  By signing in, you agree to our{" "}
                  <Link as={RouterLink} to="#" color={accentColor} fontWeight="600">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link as={RouterLink} to="#" color={accentColor} fontWeight="600">
                    Privacy Policy
                  </Link>
                  .
                </Text>
              </Stack>
            </Box>
          </Fade>
        </Flex>
      </Flex>
    </Container>
  );
}