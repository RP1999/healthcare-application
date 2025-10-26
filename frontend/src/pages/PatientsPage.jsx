import {
    Box,
    Heading,
    HStack,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Icon,
    useColorModeValue,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Text,
    Spinner,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Select,
    useToast,
    Badge,
    Flex,
  } from "@chakra-ui/react";
  import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from "react-icons/fa";
  import { useEffect, useMemo, useState, useCallback } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  
  // ---------- Axios client (reads VITE_API_URL, falls back to /api) ----------
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    withCredentials: true,
  });
  
  // ---------- Optional demo fallback data ----------

  
  function ageFromDOB(dob) {
    if (!dob) return "-";
    const d = new Date(dob);
    const diff = Date.now() - d.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  
  export default function PatientsPage() {
    const navigate = useNavigate();
    const toast = useToast();
  
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
  
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [form, setForm] = useState({
      name: "",
      nic: "",
      phone: "",
      gender: "Male",
      dob: "",
    });
    const [creating, setCreating] = useState(false);
  
    const cardBg = useColorModeValue("white", "gray.800");
    const border = useColorModeValue("gray.200", "gray.700");
  
    // ---------- Fetch helper that talks to your API ----------
    const fetchPatients = useCallback(async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/patients", {
          params: { search, page, limit },
        });
        // expecting { data: [], total: number }
        setPatients(Array.isArray(data.data) ? data.data : []);
        setTotal(typeof data.total === "number" ? data.total : 0);
      } catch (err) {
        // graceful fallback (dev only)
        const filtered = fallbackPatients.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.nic.toLowerCase().includes(search.toLowerCase()) ||
            p.phone.toLowerCase().includes(search.toLowerCase())
        );
        setPatients(filtered);
        setTotal(filtered.length);
      } finally {
        setLoading(false);
      }
    }, [search, page]);
  
    useEffect(() => {
      const t = setTimeout(fetchPatients, 250); // tiny debounce for search
      return () => clearTimeout(t);
    }, [fetchPatients]);
  
    const totalPages = useMemo(
      () => Math.max(1, Math.ceil(total / limit)),
      [total]
    );
  
    // ---------- Create (POST /api/patients) ----------
    async function handleCreate() {
      // Basic validation
      if (!form.name.trim()) {
        toast({ title: "Name is required", status: "warning" });
        return;
      }
      if (!form.nic.trim()) {
        toast({ title: "NIC is required", status: "warning" });
        return;
      }
  
      try {
        setCreating(true);
  
        // prepare payload; backend expects dob as ISO or empty
        const payload = {
          name: form.name.trim(),
          nic: form.nic.trim(),
          phone: form.phone.trim(),
          gender: form.gender,
          dob: form.dob || undefined, // send undefined if empty
        };
  
        const res = await api.post("/patients", payload);
        // Expecting { data: patient }
        const created = res?.data?.data || res?.data;
  
        if (!created || !created._id) {
          throw new Error("Unexpected API response");
        }
  
        // Option A: re-fetch for consistency
        setPage(1);
        await fetchPatients();
  
        // Option B (optimistic): prepend
        // setPatients((prev) => [created, ...prev]);
        // setTotal((t) => t + 1);
  
        toast({ title: "Patient created", status: "success" });
        onClose();
        setForm({ name: "", nic: "", phone: "", gender: "Male", dob: "" });
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Error creating patient";
        toast({ title: "Create failed", description: msg, status: "error" });
      } finally {
        setCreating(false);
      }
    }
  
    function handleView(id) {
      navigate(`/patients/${id}`);
    }
  
    function handleEdit(id) {
      navigate(`/patients/${id}/edit`);
    }
  
    // ---------- Delete (DELETE /api/patients/:id) ----------
    async function handleDelete(id) {
      try {
        await api.delete(`/patients/${id}`);
        // Re-fetch to stay in sync (and fix pagination if needed)
        await fetchPatients();
        toast({ title: "Patient deleted", status: "info" });
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Delete failed";
        toast({ title: "Delete error", description: msg, status: "error" });
      }
    }
  
    return (
      <Box p={{ base: 6, md: 10 }} minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
        <HStack justify="space-between" mb={6}>
          <Heading color={useColorModeValue("blue.600", "blue.300")}>Patients</Heading>
          <Button leftIcon={<Icon as={FaPlus} />} colorScheme="blue" onClick={onOpen}>
            Add Patient
          </Button>
        </HStack>
  
        <Box
          bg={cardBg}
          borderWidth="1px"
          borderColor={border}
          borderRadius="2xl"
          p={4}
          boxShadow="sm"
        >
          <HStack spacing={3} mb={4} align="center">
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by name / NIC / phone"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                bg={useColorModeValue("white", "gray.700")}
              />
            </InputGroup>
  
            <Badge colorScheme="blue" variant="subtle">
              {total} found
            </Badge>
          </HStack>
  
          {loading ? (
            <Flex align="center" justify="center" minH="180px">
              <Spinner size="lg" />
              <Text ml={3}>Loading patients…</Text>
            </Flex>
          ) : patients.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Text color="gray.500">No patients found.</Text>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>NIC / ID</Th>
                    <Th>Phone</Th>
                    <Th>Gender</Th>
                    <Th>DOB / Age</Th>
                    <Th textAlign="right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {patients.map((p) => (
                    <Tr key={p._id}>
                      <Td fontWeight="semibold">{p.name}</Td>
                      <Td>{p.nic || "-"}</Td>
                      <Td>{p.phone || "-"}</Td>
                      <Td>{p.gender || "-"}</Td>
                      <Td>
                        {p.dob ? (
                          <>
                            <Badge mr={2} variant="subtle">
                              {new Date(p.dob).toLocaleDateString()}
                            </Badge>
                            <Text as="span" color="gray.500">
                              {ageFromDOB(p.dob)} yrs
                            </Text>
                          </>
                        ) : (
                          "-"
                        )}
                      </Td>
                      <Td textAlign="right">
                        <HStack spacing={2} justify="flex-end">
                          <Button
                            size="xs"
                            leftIcon={<Icon as={FaEye} />}
                            onClick={() => handleView(p._id)}
                            variant="outline"
                          >
                            View
                          </Button>
                          <Button
                            size="xs"
                            leftIcon={<Icon as={FaEdit} />}
                            onClick={() => handleEdit(p._id)}
                            variant="outline"
                            colorScheme="yellow"
                          >
                            Edit
                          </Button>
                          <Button
                            size="xs"
                            leftIcon={<Icon as={FaTrash} />}
                            onClick={() => handleDelete(p._id)}
                            colorScheme="red"
                            variant="ghost"
                          >
                            Delete
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
  
          {/* Pagination */}
          <HStack justify="space-between" mt={4}>
            <Text fontSize="sm" color="gray.500">
              Page {page} of {totalPages}
            </Text>
            <HStack>
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                isDisabled={page <= 1}
                variant="outline"
              >
                Prev
              </Button>
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                isDisabled={page >= totalPages}
                variant="outline"
              >
                Next
              </Button>
            </HStack>
          </HStack>
        </Box>
  
        {/* Create Patient Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Patient</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired mb={3}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  placeholder="e.g., John Doe"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </FormControl>
              <FormControl isRequired mb={3}>
                <FormLabel>NIC / ID</FormLabel>
                <Input
                  placeholder="e.g., 200012345678"
                  value={form.nic}
                  onChange={(e) => setForm((f) => ({ ...f, nic: e.target.value }))}
                />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Phone</FormLabel>
                <Input
                  placeholder="e.g., +94 71 123 4567"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </FormControl>
              <HStack>
                <FormControl mb={3}>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Select>
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
                  />
                </FormControl>
              </HStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleCreate} isLoading={creating}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  }
  