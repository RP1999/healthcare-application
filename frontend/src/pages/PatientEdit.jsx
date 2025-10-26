import {
    Box,
    Heading,
    HStack,
    Spinner,
    Text,
    useColorModeValue,
    useToast,
    Button,
  } from "@chakra-ui/react";
  import { useEffect, useMemo, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { api } from "../lib/api";
  import PatientForm from "../components/PatientForm";
  
  function asDateInput(d) {
    if (!d) return "";
    try {
      const iso = new Date(d).toISOString();
      return iso.split("T")[0]; // yyyy-mm-dd
    } catch {
      return "";
    }
  }
  
  export default function PatientEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
  
    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState(null);
    const [saving, setSaving] = useState(false);
  
    const bg = useColorModeValue("gray.100", "gray.900");
  
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
  
    const initial = useMemo(() => {
      if (!patient) return undefined;
      return {
        name: patient.name || "",
        nic: patient.nic || "",
        phone: patient.phone || "",
        gender: patient.gender || "Male",
        dob: asDateInput(patient.dob),
      };
    }, [patient]);
  
    async function handleSubmit(values) {
      if (!values?.name?.trim()) {
        toast({ title: "Name is required", status: "warning" });
        return;
      }
      if (!values?.nic?.trim()) {
        toast({ title: "NIC is required", status: "warning" });
        return;
      }
  
      try {
        setSaving(true);
        const payload = {
          name: values.name.trim(),
          nic: values.nic.trim(),
          phone: values.phone?.trim() || "",
          gender: values.gender || "Male",
          dob: values.dob || undefined,
        };
        const { data } = await api.put(`/patients/${id}`, payload);
        toast({ title: "Patient updated", status: "success" });
        navigate(`/patients/${data?.data?._id || id}`);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Update failed";
        toast({ title: "Update error", description: msg, status: "error" });
      } finally {
        setSaving(false);
      }
    }
  
    if (loading) {
      return (
        <HStack h="60vh" align="center" justify="center" bg={bg}>
          <Spinner />
          <Text>Loading…</Text>
        </HStack>
      );
    }
  
    if (!patient) {
      return (
        <Box p={8} bg={bg}>
          <Text>Patient not found.</Text>
          <Button mt={4} onClick={() => navigate("/patients")}>Back</Button>
        </Box>
      );
    }
  
    return (
      <Box p={{ base: 6, md: 10 }} minH="100vh" bg={bg}>
        <HStack justify="space-between" mb={6}>
          <Heading>Edit Patient</Heading>
          <Button variant="outline" onClick={() => navigate(`/patients/${id}`)}>
            Cancel
          </Button>
        </HStack>
  
        <Box bg={useColorModeValue("white", "gray.800")} p={6} borderRadius="2xl">
          <PatientForm
            initial={initial}
            onSubmit={handleSubmit}
            submitting={saving}
            submitText="Update"
          />
        </Box>
      </Box>
    );
  }
  