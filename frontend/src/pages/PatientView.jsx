import {
    Badge,
    Box,
    Button,
    Heading,
    HStack,
    SimpleGrid,
    Spinner,
    Text,
    useColorModeValue,
    useToast,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { api } from "../lib/api";
  
  function line(label, value) {
    return (
      <Box>
        <Text fontSize="sm" color="gray.500">{label}</Text>
        <Text fontWeight="semibold">{value || "-"}</Text>
      </Box>
    );
  }
  
  export default function PatientView() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();
  
    const cardBg = useColorModeValue("white", "gray.800");
    const border = useColorModeValue("gray.200", "gray.700");
  
    useEffect(() => {
      (async () => {
        try {
          const { data } = await api.get(`/patients/${id}`);
          setPatient(data.data);
        } catch (err) {
          toast({ title: "Failed to load patient", status: "error" });
        } finally {
          setLoading(false);
        }
      })();
    }, [id, toast]);
  
    if (loading) {
      return (
        <HStack h="60vh" align="center" justify="center">
          <Spinner />
          <Text>Loading…</Text>
        </HStack>
      );
    }
  
    if (!patient) {
      return (
        <Box p={8}>
          <Text>Patient not found.</Text>
          <Button mt={4} onClick={() => navigate("/patients")}>Back</Button>
        </Box>
      );
    }
  
    return (
      <Box p={{ base: 6, md: 10 }} minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
        <HStack justify="space-between" mb={6}>
          <Heading color={useColorModeValue("blue.600", "blue.300")}>
            Patient Details
          </Heading>
          <HStack>
            <Button variant="outline" onClick={() => navigate("/patients")}>
              Back
            </Button>
            <Button colorScheme="blue" onClick={() => navigate(`/patients/${patient._id}/edit`)}>
              Edit
            </Button>
          </HStack>
        </HStack>
  
        <Box bg={cardBg} borderWidth="1px" borderColor={border} borderRadius="2xl" p={6}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {line("Full Name", patient.name)}
            {line("NIC / ID", patient.nic)}
            {line("Phone", patient.phone)}
            {line("Gender", patient.gender)}
            {line(
              "Date of Birth",
              patient.dob ? new Date(patient.dob).toLocaleDateString() : "-"
            )}
            <Box>
              <Text fontSize="sm" color="gray.500">Created</Text>
              <Badge variant="subtle">
                {new Date(patient.createdAt).toLocaleString()}
              </Badge>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">Updated</Text>
              <Badge variant="subtle">
                {new Date(patient.updatedAt).toLocaleString()}
              </Badge>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    );
  }
  