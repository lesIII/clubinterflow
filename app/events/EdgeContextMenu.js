import React, {useCallback, useState} from 'react';
import {useReactFlow} from 'reactflow';
import {Link} from "@nextui-org/link";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure
} from "@nextui-org/react";

export default function EdgeContextMenu({
                                            id,
                                            top,
                                            left,
                                            ...props
                                        }) {
    const { getEdge, setNodes, setEdges } = useReactFlow();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [label, setLabel] = useState(getEdge(id).label);

    //getEdge a reactflow objektumot adja vissza, ezért itt kell egy API amivel fetchelni lehet az edge-t
    const [due, setDue] = useState(getEdge(id).due || 0)

    const deleteEdge = useCallback(() => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    }, [id, setEdges]);

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
                <Link style={{cursor: 'pointer'}} color="success">Edit</Link><br></br>
                <Link style={{cursor: 'pointer'}} color="success">Delete</Link><br></br>
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
