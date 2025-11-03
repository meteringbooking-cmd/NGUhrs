// employees.js — SHARED ACROSS ALL PAGES
window.EMPLOYEES = {
    data: [],
    STORAGE_KEY: 'ngu_employees',

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
            if (!Array.isArray(emp.absences)) emp.absences = [];
            if (!emp.startDate) emp.startDate = null;
            if (!emp.dateLeft) emp.dateLeft = null;
            if (emp.holidayRemaining === undefined) emp.holidayRemaining = 25;
            if (emp.holidayTaken === undefined) emp.holidayTaken = 0;
            if (emp.absenceDays === undefined) emp.absenceDays = 0;
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
            absences: [],
            startDate: null,
            dateLeft: null,
            holidayRemaining: 25,
            holidayTaken: 0,
            absenceDays: 0
        };
        this.data.push(emp);
        this.save();
        return emp;
    },

    remove(id) {
        this.data = this.data.filter(e => e.id !== id);
        this.save();
    }
};

EMPLOYEES.init();
