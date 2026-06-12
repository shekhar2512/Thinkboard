import Note from "../models/Note.js";

// Fetch all notes
export async function getAllNotes(req, res) {
    try {
        let filter = {};
        if (req.query.createdBy) {
    // $regex does a partial match, $options: "i" makes it case-insensitive!
            console.log("Backend received search for: ", req.query.createdBy);
            filter.createdBy = { $regex: req.query.createdBy, $options: "i" };
        }
        const notes = await Note.find(filter).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Fetch a single note by ID
export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNoteById controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Create a new note
export async function createNote(req, res) {
    try {
        const { title, content, createdBy } = req.body;
        console.log("Creating note with title:", title);
        console.log("Creating note with content:", content);
        console.log("Creating note with createdBy:", createdBy);
        if (!title || !content || !createdBy) {
            return res.status(400).json({ message: "Title, content, and createdBy are required" });
        }
        const note = new Note({ title, content, createdBy });
        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error("Error in createNote controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Update an existing note
export async function updateNote(req, res) {
    try {
        const { title, content, createdBy } = req.body;
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        if (createdBy !== undefined) note.createdBy = createdBy;
        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error in updateNote controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Delete a note
export async function deleteNote(req, res) {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error in deleteNote controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
