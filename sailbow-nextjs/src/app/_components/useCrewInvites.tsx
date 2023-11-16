"use client"
import { Box, Button, Flex, HStack, Input, InputGroup, InputRightElement, Select, Tag, TagCloseButton, TagLabel, VStack, useToast } from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { z } from 'zod'

const emailSchema = z.string().email()

const getRandomPastelColor = () => {
  const h = Math.floor(Math.random() * 361);
  return `hsl(${h}, 75%, 85%)`;
}

type CrewInviteItem = {
  email: string,
  color: string,
  role: "crewMember" | "firstMate"
}

type UseCrewInviteItems = {
  crewInvites: CrewInviteItem[],
  EmailInputElement: JSX.Element
}


function useCrewInvites(): UseCrewInviteItems {
  const [crewInvites, setCrewInvites] = useState<CrewInviteItem[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const toast = useToast()
  const invalidEmailToastId = "invalid-email-toast"
  const emailAlreadyAddedToastId = "email-already-added"

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value)
  }

  const addEmail = () => {
    const parsed = emailSchema.safeParse(inputValue.trim())
    if (!parsed.success) {
      !toast.isActive(invalidEmailToastId) && toast({
        id: invalidEmailToastId,
        title: "Must use a valid email",
        status: "error",
        isClosable: true,
        position: "top"
      })
      return
    }
    if (crewInvites.some(b => b.email === parsed.data)) {
      !toast.isActive(emailAlreadyAddedToastId) && toast({
        id: invalidEmailToastId,
        title: `The email '${parsed.data}' has already been added!`,
        status: "warning",
        isClosable: true,
        position: "top"
      })
      return
    }

    const newInvite = {
      email: parsed.data,
      color: getRandomPastelColor(),
      role: "crewMember"
    } satisfies CrewInviteItem

    const newInvites = [...crewInvites, newInvite]
    setCrewInvites(newInvites)
    setInputValue("")
  }

  const handleInputKeyDown = (event: any): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addEmail()
    }
  }

  const handleTagClose = (index: number): void => {
    const newInvites = [...crewInvites]
    newInvites.splice(index, 1)
    setCrewInvites(newInvites)
  }

  const handleRoleChange = (index: number, role: string): void => {
    const newInvites = [...crewInvites]
    const invite = newInvites.at(index)
    if (invite) {
      invite.role = role as "crewMember" | "firstMate"
      setCrewInvites(newInvites)
    }
  }

  return {
    crewInvites: crewInvites,
    EmailInputElement: (
      <Box>
        <InputGroup size='md'>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Enter email"
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' colorScheme="teal" onClick={addEmail}>Add</Button>
          </InputRightElement>
        </InputGroup>
        <Box mt={2} maxH="300px" overflow="scroll" p={2}>
          <VStack spacing={4}>
            {crewInvites.map((invite, index) => (
              <HStack key={index} spacing={2} justify="space-between" align="center" width="100%">
                <Tag bgColor={invite.color} mr={2} mb={2}>
                  <TagLabel>{invite.email}</TagLabel>
                  <TagCloseButton onClick={() => handleTagClose(index)} />
                </Tag>
                <Select
                  onChange={(e) => handleRoleChange(index, e.target.value)}
                  width={200}
                  minWidth={200}
                  size="md"
                  colorScheme="teal"
                >
                  <option value="crewMember">Crew Member</option>
                  <option value="firstMate">First Mate</option>
                </Select>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Box>
    )
  }
}

export default useCrewInvites