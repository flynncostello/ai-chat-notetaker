import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFolders } from '../features/folders/foldersSlice';
import { addFolder, addNoteToFolder } from '../features/folders/foldersSlice';
import { v4 as uuidv4 } from "uuid";
import './ConversationSaveForm.css';

const ConversationSaveForm = ({ conversation, handleStartSaveProcess }) => {
    const [selectedFolderId, setSelectedFolderId] = useState('');
    const [newFolderName, setNewFolderName] = useState('');

    // Clear newFolderName when selectedFolderId changes
    useEffect(() => {
        if (selectedFolderId !== "") {
            setNewFolderName("");
        }
    }, [selectedFolderId]);

    // Clear selectedFolderId when newFolderName changes
    useEffect(() => {
        if (newFolderName !== "") {
            setSelectedFolderId("");
        }
    }, [newFolderName]);

    const dispatch = useDispatch();

    const folders = useSelector(selectFolders);

    // Function handles summarising conversation using OpenAI API
    const summariseConversation = (conversation) => {
        const conversationRecord = conversation.conversationRecord; /// OpenAI API ///
        const summary = "Hello";
        return summary;
    }

    const handleSaveConversation = (e) => {
        e.preventDefault();
        const summarisedConversation = summariseConversation(conversation);
        const newNote = {
            id: uuidv4(),
            name: conversation.name,
            date: conversation.date,
            description: conversation.description,
            summary: summarisedConversation,
        };

        if(!selectedFolderId && !newFolderName) {
            alert("Please choose an existing folder or enter a new folder name.");
            return;
        }
        
        if(selectedFolderId) {
            dispatch(addNoteToFolder({ folderId: selectedFolderId, note: newNote }));
        } else if (newFolderName) {
            const newFolder = {
                id: uuidv4(),
                name: newFolderName,
                notes: {},
            }
            dispatch(addFolder(newFolder));
            dispatch(addNoteToFolder({ folderId: newFolder.id, note: newNote }));
        }

        // Removing save input for current conversation
        handleStartSaveProcess();
        alert("Conversation saved!");
    };

    return (
        <form onSubmit={handleSaveConversation} className='save-conversation-form'>
            <div className='select-folder'>
                <select id="existing-folders" value={selectedFolderId} className='select-folder-select' onChange={(e) => setSelectedFolderId(e.target.value)}>
                    <option value="">Select an existing folder</option>
                    {Object.values(folders).map((folder) => (
                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                </select>
                <input type="text" value={newFolderName} className='select-folder-input' onChange={(e) => setNewFolderName(e.target.value)} placeholder="Or enter a new folder" />
            </div>
            <button type="submit" id='save-conversation-final-button'>Confirm</button>
        </form>
    );
};

export default ConversationSaveForm;