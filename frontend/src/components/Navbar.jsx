// frontend/src/components/Navbar.jsx
import {
	Box,
	Flex,
	HStack,
	IconButton,
	useColorModeValue,
	useDisclosure,
	Stack,
	Heading,
	Link as ChakraLink,
	Button,
	Text,
  } from "@chakra-ui/react";
  import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
  import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
  import { useAuth } from "../store/auth";
  
  const links = [
	{ name: "Home", path: "/" },
	{ name: "Patients", path: "/patients" },
	{ name: "Doctors", path: "/doctors" },
	{ name: "Appointments", path: "/appointments" },
	{ name: "Billing", path: "/billing" },
  ];
  
  function NavLink({ name, path }) {
	const location = useLocation();
	const active = location.pathname === path;
	const color = useColorModeValue(active ? "blue.600" : "gray.600", active ? "blue.300" : "gray.300");
  
	return (
	  <ChakraLink
		as={RouterLink}
		px={3}
		py={2}
		rounded="md"
		fontWeight={active ? "bold" : "medium"}
		color={color}
		_hover={{
		  textDecoration: "none",
		  bg: useColorModeValue("blue.50", "gray.700"),
		}}
		to={path}
	  >
		{name}
	  </ChakraLink>
	);
  }
  
  export default function Navbar() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const bg = useColorModeValue("white", "gray.800");
	const border = useColorModeValue("gray.200", "gray.700");
  
	const user = useAuth((s) => s.user);
	const logout = useAuth((s) => s.logout);
	const navigate = useNavigate();
  
	const handleLogout = () => {
	  logout();
	  navigate("/signin", { replace: true });
	};
  
	return (
	  <Box bg={bg} px={4} boxShadow="sm" borderBottomWidth="1px" borderColor={border}>
		<Flex h={16} alignItems="center" justifyContent="space-between">
		  {/* Left: Logo / Title */}
		  <Heading
			as={RouterLink}
			to="/"
			fontSize="xl"
			color={useColorModeValue("blue.600", "blue.300")}
			_hover={{ textDecoration: "none" }}
		  >
			🏥 MediLink
		  </Heading>
  
		  {/* Desktop links */}
		  <HStack spacing={4} display={{ base: "none", md: "flex" }}>
			{links.map((link) => (
			  <NavLink key={link.name} {...link} />
			))}
		  </HStack>
  
		  {/* Right: Auth actions */}
		  <HStack spacing={3} display={{ base: "none", md: "flex" }}>
			{user ? (
			  <>
				<Text fontSize="sm" color={useColorModeValue("gray.700", "gray.200")}>
				  Hi, <strong>{user.name}</strong>
				</Text>
				<Button size="sm" variant="outline" onClick={handleLogout}>
				  Logout
				</Button>
			  </>
			) : (
			  <>
				<Button as={RouterLink} to="/signin" size="sm" variant="ghost">
				  Sign in
				</Button>
				<Button as={RouterLink} to="/signup" size="sm" colorScheme="blue">
				  Sign up
				</Button>
			  </>
			)}
		  </HStack>
  
		  {/* Mobile menu icon */}
		  <Flex alignItems="center" display={{ md: "none" }}>
			<IconButton
			  size="md"
			  icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
			  aria-label="Open menu"
			  onClick={isOpen ? onClose : onOpen}
			  variant="ghost"
			/>
		  </Flex>
		</Flex>
  
		{/* Mobile menu */}
		{isOpen ? (
		  <Box pb={4} display={{ md: "none" }}>
			<Stack as="nav" spacing={2}>
			  {links.map((link) => (
				<NavLink key={link.name} {...link} />
			  ))}
  
			  {/* Mobile: Auth actions */}
			  <Box pt={2} borderTopWidth="1px" borderColor={border}>
				{user ? (
				  <HStack justify="space-between" mt={3}>
					<Text fontSize="sm">Hi, <strong>{user.name}</strong></Text>
					<Button size="sm" variant="outline" onClick={handleLogout}>
					  Logout
					</Button>
				  </HStack>
				) : (
				  <HStack mt={3} spacing={3}>
					<Button as={RouterLink} to="/signin" size="sm" variant="ghost" onClick={onClose}>
					  Sign in
					</Button>
					<Button as={RouterLink} to="/signup" size="sm" colorScheme="blue" onClick={onClose}>
					  Sign up
					</Button>
				  </HStack>
				)}
			  </Box>
			</Stack>
		  </Box>
		) : null}
	  </Box>
	);
  }
  