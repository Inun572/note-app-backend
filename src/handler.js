const { nanoid } = require("nanoid");
const notes = require("./notes");

// handler untuk menambah catatan
const addNoteHandler = (req, h) => {

    // tangkap data dari client
    const { title, tags, body } = req.payload;

    // data yang dibutuhkan namun tidak dari client
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // atur susunan data
    const newNote = {
        id, title, createdAt, updatedAt, tags, body
    };

    // tambahkan ke array notes untuk ditampung
    notes.push(newNote);

    // validasi apabila ada data masuk ke notes
    const isSuccess = notes.filter((note)=>note.id === id).length > 0;

    // jika ada
    if (isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id
            }
        });
        response.code(201);
        return response;
    }

    // jika tidak ada
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan catatan'
    });
    response.code(500);
    return response;

}

// handler untuk menampilkan semua catatan
const getAllNotesHandler = () => ({
    
    status: 'success',
    data: {
        notes
    }
    
});

// handler untuk menampilkan catatan by id
const getNoteByIdHandler = (req, h) => {
    // tangkap note id dari client
    const { id } = req.params;

    // cari note dengan id yang sama menggunakan array filter dari notes
    const note = notes.filter((note) => note.id === id)[0];

    if(note !== undefined){
        return {
            status: 'success',
            data: {
                note
            }
        }
    };
    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan'
    });
    response.code(404);
    return response;
};

// handler untuk edit catatan by id
const editNoteByIdHandler = (req, h) => {
    // tangkap note id dari client
    const { id } = req.params;

    // tangkap data dari client
    const { title, tags, body } = req.payload;

    // update tanggal pembaruan
    const updatedAt = new Date().toISOString();

    // cari index note sesuai id pada array notes
    const index = notes.findIndex((note)=> note.id === id);
    
    // update data note
    if(index !== -1){
        notes[index] = {
            ...notes[index],
            title,
            updatedAt,
            tags,
            body            
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan'
    });
    response.code(404);
    return response;
}

// handler untuk delete catatan
const deleteNoteById = (req, h) => {
    // tangkap id dari client
    const { id } = req.params;

    // cari index note sesuai id pada array notes
    const index = notes.findIndex((note)=> note.id === id);

    // delete note sesuai id
    if(index !== -1){
        notes.splice(index, 1);

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal menghapus catatan. Id tidak ditemukan'
    });
    response.code(404);
    return response;
}

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteById };