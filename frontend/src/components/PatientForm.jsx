import {
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Select,
  } from "@chakra-ui/react";
  import { useState, useEffect } from "react";
  
  export default function PatientForm({
    initial = { name: "", nic: "", phone: "", gender: "Male", dob: "" },
    onSubmit,
    submitting = false,
    submitText = "Save",
  }) {
    const [form, setForm] = useState(initial);
  
    useEffect(() => {
      setForm((f) => ({ ...f, ...initial }));
    }, [initial]);
  
    return (
      <Box as="form" onSubmit={(e) => { e.preventDefault(); onSubmit?.(form); }}>
        <FormControl isRequired mb={3}>
          <FormLabel>Full Name</FormLabel>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g., John Doe"
          />
        </FormControl>
  
        <FormControl isRequired mb={3}>
          <FormLabel>NIC / ID</FormLabel>
          <Input
            value={form.nic}
            onChange={(e) => setForm((f) => ({ ...f, nic: e.target.value }))}
            placeholder="e.g., 200012345678"
          />
        </FormControl>
  
        <FormControl mb={3}>
          <FormLabel>Phone</FormLabel>
          <Input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="e.g., +94 71 123 4567"
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
              value={form.dob || ""}
              onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
            />
          </FormControl>
        </HStack>
  
        <HStack justify="flex-end" mt={4}>
          <Button colorScheme="blue" type="submit" isLoading={submitting}>
            {submitText}
          </Button>
        </HStack>
      </Box>
    );
  }
  