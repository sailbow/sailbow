"use client"
import { Box, Button, Input, InputGroup, InputRightElement, Tag, TagCloseButton, TagLabel, useToast } from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { z } from 'zod'

const emailSchema = z.string().email()

const getRandomPastelColor = () => {
  const h = Math.floor(Math.random() * 361);
  return `hsl(${h}, 75%, 85%)`;
}

const EmailsInput: React.FC = () => {
  const [emails, setEmails] = useState<{ email: string; color: string }[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const toast = useToast()
  const invalidEmailToastId = "invalid-email-toast"

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
    const newEmail = {
      email: parsed.data,
      color: getRandomPastelColor(),
    }
    const newEmails = [...emails, newEmail]
    setEmails(newEmails)
    setInputValue("")
  }

  const handleInputKeyDown = (event: any): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addEmail()
    }
  }

  const handleTagClose = (index: number): void => {
    const newEmails = [...emails]
    newEmails.splice(index, 1)
    setEmails(newEmails)
  }

  return (
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
      <Box mt={2}>
        {emails.map((email, index) => (
          <Tag key={email.email} bgColor={email.color} mr={2} mb={2}>
            <TagLabel>{email.email}</TagLabel>
            <TagCloseButton onClick={() => handleTagClose(index)} />
          </Tag>
        ))}
      </Box>
    </Box>
  )
}

export default EmailsInput