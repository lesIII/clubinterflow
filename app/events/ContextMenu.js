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
    Input,
} from '@nextui-org/react';

export default function ContextMenu({
                                        id,
                                        top,
                                        left,
                                        ...props
                                    }) {
    const { getNode, setNodes, setEdges } = useReactFlow();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [inputValue, setInputValue] = useState('');

    const renameNode = useCallback(() => {
        const node = getNode(id);
        const updatedNode = { ...node, data: { ...node.data, label: inputValue } };

        setNodes(nodes =>
            nodes.map(n => (n.id === id ? updatedNode : n))
        );
    }, [id, inputValue, getNode, setNodes]);

    const deleteNode = useCallback(() => {
        setNodes(nodes => nodes.filter(node => node.id !== id));
        setEdges(edges => edges.filter(edge => edge.source !== id));
    }, [id, setNodes, setEdges]);

    const handleSave = () => {
        renameNode();
        onClose(); // Close the modal after saving
    };

    return (
        <>
            <div
                style={{ position: 'absolute', top, left }}
                className="context-menu"
                {...props}
            >
                <p style={{ margin: '0.5em' }}>
                    <small>node: {id}</small>
                </p>
                <Button onPress={onOpen} color="primary">
                    Open Modal
                </Button>
                <button onClick={deleteNode}>Delete</button>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Manager</ModalHeader>
                    <ModalBody>
                        <Input
                            autoFocus
                            placeholder="Set the manager"
                            variant="bordered"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                        />
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
