// employees.js — Central Employee Database (SHARED ACROSS ALL PAGES)
window.EMPLOYEES = {
    data: [],
    STORAGE_KEY: 'ngu_employees', // ← SAME KEY EVERYWHERE

    init() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        this.data = saved ? JSON.parse(saved) : [];
        this.ensureStructure();
        this.save();
    },

    ensureStructure() {
        this.data.forEach(emp => {
            if (!emp.id) emp.id = this.generateId();
            if (!emp.name) emp.name = 'Unknown';
            if (!emp.absences) emp.absences = [];
            if (emp.holidayRemaining === undefined) emp.holidayRemaining = 25;
            if (emp.holidayTaken === undefined) emp.holidayTaken = 0;
            if (emp.absenceDays === undefined) emp.absenceDays = 0;
            if (emp.bonus === undefined) emp.bonus = 0;
            if (emp.additionalPayments === undefined) emp.additionalPayments = 0;
        });
    },

    generateId() {
        const next = this.data.length + 1;
        return `EMP${String(next).padStart(3, '0')}`;
    },

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    },

    add(name) {
        const id = this.generateId();
        const emp = {
            id,
            name: name.trim(),
            absences: [],                    // ← REQUIRED FOR ABSENCE PAGE
            holidayRemaining: 25,
            holidayTaken: 0,
            absenceDays: 0,
            bonus: 0,
            additionalPayments: 0
        };
        this.data.push(emp);
        this.save();
        return emp;
    },

    remove(id) {
        this.data = this.data.filter(e => e.id !== id);
        this.save();
    },

    findByNameOrId(query) {
        query = query.toLowerCase();
        return this.data.find(e =>
            e.name.toLowerCase().includes(query) ||
            e.id.toLowerCase() === query
        );
    },

    update(id, updates) {
        const emp = this.data.find(e => e.id === id);
        if (emp) {
            Object.assign(emp, updates);
            this.save();
        }
        return emp;
    },

    exportCSV() {
        const headers = ['id', 'name', 'holidayRemaining', 'holidayTaken', 'absenceDays', 'bonus', 'additionalPayments'];
        let csv = headers.join(',') + '\n';
        this.data.forEach(e => {
            csv += headers.map(h => `"${(e[h] ?? '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'employees.csv'; a.click();
    }
};

// Auto-init on every page
EMPLOYEES.init();
