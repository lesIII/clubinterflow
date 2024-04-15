import React, {useCallback, useState} from 'react';
import {Handle, NodeToolbar, Position, useReactFlow} from 'reactflow';
import './handle.css';
import {
    Button,
    ButtonGroup, Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem, useDisclosure
} from "@nextui-org/react";

const managers = [
    { id: 'president', label: 'President' },
    { id: 'vice_president', label: 'Vice President' },
    { id: 'event_manager', label: 'Event Manager' },
    { id: 'pr_manager', label: 'PR Manager' },
    { id: 'technician', label: 'Technician' },
    { id: 'logistics_manager', label: 'Logistics Manager' },
    { id: 'hygiene_manager', label: 'Hygiene Manager' },
    { id: 'finances_manager', label: 'Finances Manager' },
    { id: 'internal_event_manager', label: 'Internal Event Manager' }
];

function CustomNode({ data }) {

    const { getNode, setNodes, setEdges } = useReactFlow();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [manager, setManager] = useState(getNode(data.id).data.label);

    const setNode = useCallback(() => {
        const node = getNode(data.id);
        const updatedNode = { ...node, data: { ...node.data, label: manager } };

        setNodes(nodes =>
            nodes.map(n => (n.id === data.id ? updatedNode : n))
        );

    }, [data.id, manager, getNode, setNodes]);

    const deleteNode = useCallback(() => {
        data.setNodes(nodes => nodes.filter(node => node.id !== data.id));
        data.setEdges(edges => edges.filter(edge => edge.source !== data.id));
    }, [data]);

    const handleSave = () => {
        setNode();
        onClose();
    };

    const handleSelectionChange = (e) => {
        setManager(e.target.value)
    };
    
    return (
        <>
            <NodeToolbar
                position={data.toolbarPosition}
            >
                <ButtonGroup>
                    <Button onPress={onOpen} color="success" variant="ghost" size="sm" radius="full">Set manager</Button>
                    <Button onPress={deleteNode} color="success" variant="ghost" size="sm" radius="full">Delete</Button>
                </ButtonGroup>
            </NodeToolbar>
            {data.label}
            <Handle type="source" position={Position.Right} id="a" className="react-flow__handle .react-flow__handle-right" />
            <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Manager</ModalHeader>
                    <ModalBody>
                        <Select
                            label="Set the manager"
                            variant="underlined"
                            color="success"
                            placeholder={manager}
                            selectedKeys={[manager]}
                            className="max-w-xs"
                            onChange={handleSelectionChange}>
                            {managers.map((manager) => (
                                <SelectItem key={manager.label} value={manager.label}>
                                    {manager.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                            Close
                        </Button>
                        <Button onPress={handleSave} color="success">
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default CustomNode