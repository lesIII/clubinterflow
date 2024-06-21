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

import {Managers} from "../roles";

function CustomNode({ data, isConnectable }) {

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
        const selectedKey = e.target.value;
        const selectedValue = Managers[selectedKey];
        setManager(selectedValue);
    };
    
    return (
        <>
            {data.editorMode ? (
                <NodeToolbar
                    position={data.toolbarPosition}
                >
                    <ButtonGroup>
                        <Button onPress={onOpen} color="success" variant="ghost" size="sm" radius="full">Set manager</Button>
                        <Button onPress={deleteNode} color="success" variant="ghost" size="sm" radius="full">Delete</Button>
                    </ButtonGroup>
                </NodeToolbar>
            ) : <></>}

            {data.label}
            <Handle isConnectable={isConnectable} type="source" position={Position.Right} id="a" className="react-flow__handle .react-flow__handle-right" />
            <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Manager</ModalHeader>
                    <ModalBody>
                        <Select
                            label="Set the manager"
                            variant="underlined"
                            color="success"
                            placeholder={getNode(data.id).data.label}
                            selectedKeys={Managers[manager]}
                            className="max-w-xs"
                            onChange={handleSelectionChange}>
                            {Object.entries(Managers).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                    {value}
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