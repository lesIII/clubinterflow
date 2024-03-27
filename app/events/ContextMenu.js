import React, { useCallback, useState } from 'react';
import { useReactFlow } from 'reactflow';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Select,
    SelectItem
} from '@nextui-org/react';
import {Link} from "@nextui-org/link";

export default function ContextMenu({
                                        id,
                                        top,
                                        left,
                                        ...props
                                    }) {
    const { getNode, setNodes, setEdges } = useReactFlow();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [manager, setManager] = useState(getNode(id).data.label);

    const renameNode = useCallback(() => {
        const node = getNode(id);
        const updatedNode = { ...node, data: { ...node.data, label: manager } };

        setNodes(nodes =>
            nodes.map(n => (n.id === id ? updatedNode : n))
        );


    }, [id, manager, getNode, setNodes]);

    const deleteNode = useCallback(() => {
        setNodes(nodes => nodes.filter(node => node.id !== id));
        setEdges(edges => edges.filter(edge => edge.source !== id));
    }, [id, setNodes, setEdges]);

    const handleSave = () => {
        renameNode();
        onClose();
    };

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


    const handleSelectionChange = (e) => {
        setManager(e.target.value)
    };

    return (
        <>
            <div
                style={{position: 'absolute', top, left}}
                className="context-menu"
                {...props}
            >
                <p style={{margin: '0.5em'}}>
                    <small>{id}</small>
                </p>
                <Link onPress={onOpen} style={{ cursor: 'pointer' }} color="success" >Edit</Link><br></br>
                <Link onPress={deleteNode} style={{ cursor: 'pointer' }} color="success" >Delete</Link><br></br>
            </div>
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
                        <Button color="success" onPress={handleSave}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
