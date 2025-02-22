'use client'

import { useState } from "react";
import { Button, Input, Text, VStack } from "@chakra-ui/react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

const mockUsers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
  { id: 4, name: "Bob Brown" },
  { id: 5, name: "Bob Brown" },
  { id: 6, name: "Bob Brown" },
  { id: 7, name: "Bob Brown" },
  { id: 9, name: "Bob Brown" },
  { id: 8, name: "Bob Brown" },
  { id: 73, name: "Bob Brown" },
  { id: 45, name: "Bob Brown" },
  { id: 43, name: "Bob Brown" },
  { id: 42, name: "Bob Brown" },
  { id: 41, name: "Bob Brown" },
];

const GroupCreationPopover = () => {
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserSelection = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" colorScheme="blue">
          Create Group
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-white shadow-lg rounded-lg p-4 w-64">
        <PopoverArrow />
        <PopoverBody>
          <PopoverTitle fontWeight="medium" color="blue.600">
            Create Group
          </PopoverTitle>
          <Text my="2" fontSize="sm" color="gray.600">
            Enter group name and select members.
          </Text>
          <Input
            placeholder="Group name"
            size="sm"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            mb="2"
          />
          <Input
            placeholder="Search users"
            size="sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb="2"
          />
          <VStack align="start" spacing="1" maxH="150px" overflowY="auto">
            {filteredUsers.map((user) => (
              <Checkbox
                key={user.id}
                isChecked={selectedUsers.includes(user.id)}
                onChange={() => toggleUserSelection(user.id)}
              >
                {user.name}
              </Checkbox>
            ))}
          </VStack>
          <div className="flex justify-end mt-4 gap-2">
            <Button size="sm" colorScheme="gray" variant="outline">
              Cancel
            </Button>
            <Button size="sm" colorScheme="blue">
              Create
            </Button>
          </div>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default GroupCreationPopover;
