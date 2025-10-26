import {
	Box,
	Heading,
	Text,
	SimpleGrid,
	Card,
	CardHeader,
	CardBody,
	Button,
	Icon,
	useColorModeValue,
	Flex,
	Container,
	Stack,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	Grid,
	GridItem,
	Avatar,
	AvatarGroup,
	Badge,
	HStack,
	VStack,
	useToken,
  } from "@chakra-ui/react";
  import { 
	FaUserInjured, 
	FaUserMd, 
	FaCalendarAlt, 
	FaFileInvoice, 
	FaChartLine, 
	FaShieldAlt, 
	FaClock,
	FaDollarSign,
	FaStethoscope,
	FaHospital,
	FaProcedures
  } from "react-icons/fa";
  import { useNavigate } from "react-router-dom";
  
  export default function HomePage() {
	const navigate = useNavigate();
  
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const primaryColor = useColorModeValue("blue.600", "blue.300");
	const secondaryColor = useColorModeValue("gray.600", "gray.400");
  
	const stats = [
	  { label: "Active Patients", value: "2,847", change: "+12%", arrow: "increase", icon: FaUserInjured, color: "blue.500" },
	  { label: "Today's Appointments", value: "156", change: "+8%", arrow: "increase", icon: FaCalendarAlt, color: "green.500" },
	  { label: "Medical Staff", value: "89", change: "+5%", arrow: "increase", icon: FaUserMd, color: "purple.500" },
	  { label: "Monthly Revenue", value: "$284K", change: "+15%", arrow: "increase", icon: FaDollarSign, color: "orange.500" },
	];
  
	const modules = [
	  {
		title: "Patient Management",
		description: "Manage patient records, medical history, and treatment plans",
		icon: FaUserInjured,
		color: "blue.500",
		link: "/patients",
		count: "2,847 Patients"
	  },
	  {
		title: "Medical Staff",
		description: "Doctor schedules, specialist assignments, and staff management",
		icon: FaUserMd,
		color: "teal.500",
		link: "/doctors",
		count: "89 Staff"
	  },
	  {
		title: "Appointments",
		description: "Schedule, reschedule, and manage patient appointments",
		icon: FaCalendarAlt,
		color: "orange.500",
		link: "/appointments",
		count: "156 Today"
	  },
	  {
		title: "Billing & Insurance",
		description: "Process payments, manage claims, and generate invoices",
		icon: FaFileInvoice,
		color: "purple.500",
		link: "/billing",
		count: "$284K Revenue"
	  },
	];
  
	const quickActions = [
	  { label: "New Patient", icon: FaUserInjured, color: "blue" },
	  { label: "Schedule Appointment", icon: FaCalendarAlt, color: "green" },
	  { label: "Generate Invoice", icon: FaFileInvoice, color: "orange" },
	  { label: "View Reports", icon: FaChartLine, color: "purple" },
	];
  
	return (
	  <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh">
		<Container maxW="7xl" py={8}>
		  {/* Header Section */}
		  <Flex justify="space-between" align="center" mb={8}>
			<Box>
			  <Heading size="lg" color={primaryColor} mb={2}>
				MediLink Dashboard
			  </Heading>
			  <Text color={secondaryColor} fontSize="lg">
				Welcome back, Dr. Smith. Here's your overview for today.
			  </Text>
			</Box>
			<Badge colorScheme="green" px={3} py={1} borderRadius="full" fontSize="sm">
			  Live • All Systems Operational
			</Badge>
		  </Flex>
  
		  {/* Stats Overview */}
		  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
			{stats.map((stat, index) => (
			  <Card key={stat.label} bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg">
				<CardBody>
				  <Flex align="center" justify="space-between">
					<Box>
					  <Stat>
						<StatLabel color={secondaryColor} fontSize="sm" fontWeight="medium">
						  {stat.label}
						</StatLabel>
						<StatNumber fontSize="2xl" fontWeight="bold" color={primaryColor}>
						  {stat.value}
						</StatNumber>
						<StatHelpText>
						  <StatArrow type={stat.arrow} />
						  {stat.change} from last month
						</StatHelpText>
					  </Stat>
					</Box>
					<Icon as={stat.icon} boxSize={8} color={stat.color} opacity={0.8} />
				  </Flex>
				</CardBody>
			  </Card>
			))}
		  </SimpleGrid>
  
		  {/* Main Content Grid */}
		  <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
			{/* Left Column - Modules */}
			<GridItem>
			  <Card bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" mb={6}>
				<CardHeader pb={4}>
				  <Heading size="md">System Modules</Heading>
				  <Text color={secondaryColor} fontSize="sm">Access all healthcare management features</Text>
				</CardHeader>
				<CardBody pt={0}>
				  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
					{modules.map((module) => (
					  <Card 
						key={module.title}
						border="1px"
						borderColor={borderColor}
						borderRadius="md"
						cursor="pointer"
						transition="all 0.2s"
						_hover={{ 
						  transform: "translateY(-2px)",
						  borderColor: module.color,
						  shadow: "md"
						}}
						onClick={() => navigate(module.link)}
					  >
						<CardBody>
						  <Flex align="start" gap={4}>
							<Icon as={module.icon} boxSize={6} color={module.color} mt={1} />
							<Box flex={1}>
							  <Heading size="sm" mb={1}>{module.title}</Heading>
							  <Text fontSize="sm" color={secondaryColor} mb={2}>
								{module.description}
							  </Text>
							  <Badge colorScheme={module.color.split('.')[0]} variant="subtle" fontSize="xs">
								{module.count}
							  </Badge>
							</Box>
						  </Flex>
						</CardBody>
					  </Card>
					))}
				  </SimpleGrid>
				</CardBody>
			  </Card>
			</GridItem>
  
			{/* Right Column - Quick Actions & Recent Activity */}
			<GridItem>
			  {/* Quick Actions */}
			  <Card bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" mb={6}>
				<CardHeader pb={4}>
				  <Heading size="md">Quick Actions</Heading>
				</CardHeader>
				<CardBody pt={0}>
				  <Stack spacing={3}>
					{quickActions.map((action) => (
					  <Button
						key={action.label}
						variant="outline"
						justifyContent="start"
						leftIcon={<Icon as={action.icon} />}
						colorScheme={action.color}
						size="md"
						height="12"
					  >
						{action.label}
					  </Button>
					))}
				  </Stack>
				</CardBody>
			  </Card>
  
			  {/* System Status */}
			  <Card bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg">
				<CardHeader pb={4}>
				  <Heading size="md">System Status</Heading>
				</CardHeader>
				<CardBody pt={0}>
				  <Stack spacing={4}>
					<Flex justify="space-between" align="center">
					  <HStack>
						<Icon as={FaShieldAlt} color="green.500" />
						<Text fontSize="sm">Security & Compliance</Text>
					  </HStack>
					  <Badge colorScheme="green" variant="subtle">Active</Badge>
					</Flex>
					<Flex justify="space-between" align="center">
					  <HStack>
						<Icon as={FaClock} color="green.500" />
						<Text fontSize="sm">Uptime</Text>
					  </HStack>
					  <Badge colorScheme="green" variant="subtle">99.9%</Badge>
					</Flex>
					<Flex justify="space-between" align="center">
					  <HStack>
						<Icon as={FaStethoscope} color="green.500" />
						<Text fontSize="sm">Medical Records</Text>
					  </HStack>
					  <Badge colorScheme="green" variant="subtle">Synced</Badge>
					</Flex>
				  </Stack>
				</CardBody>
			  </Card>
			</GridItem>
		  </Grid>
  
		  {/* Recent Activity Section */}
		  <Card bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" mt={6}>
			<CardHeader pb={4}>
			  <Heading size="md">Recent Activity</Heading>
			  <Text color={secondaryColor} fontSize="sm">Latest updates from your healthcare facility</Text>
			</CardHeader>
			<CardBody pt={0}>
			  <Stack spacing={4}>
				{[
				  { action: "New patient registration", user: "Sarah Johnson", time: "10:30 AM", type: "patient" },
				  { action: "Appointment scheduled", user: "Dr. Michael Chen", time: "09:15 AM", type: "appointment" },
				  { action: "Invoice generated", user: "Billing Department", time: "Yesterday", type: "billing" },
				  { action: "Medical record updated", user: "Nurse Williams", time: "Yesterday", type: "record" },
				].map((activity, index) => (
				  <Flex key={index} justify="space-between" align="center" py={2}>
					<HStack spacing={4}>
					  <Avatar size="sm" name={activity.user} />
					  <Box>
						<Text fontSize="sm" fontWeight="medium">{activity.action}</Text>
						<Text fontSize="sm" color={secondaryColor}>{activity.user}</Text>
					  </Box>
					</HStack>
					<Text fontSize="sm" color={secondaryColor}>{activity.time}</Text>
				  </Flex>
				))}
			  </Stack>
			</CardBody>
		  </Card>
		</Container>
	  </Box>
	);
  }