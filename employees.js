// employees.js — Central Employee Database
window.EMPLOYEES = {
    data: [], // All employees
    init() {
        const saved = localStorage.getItem('ngu_employees');
        this.data = saved ? JSON.parse(saved) : [];
        this.ensureIds();
    },
    ensureIds() {
        let next = Math.max(...this.data.map(e => parseInt(e.id?.replace('EMP', '') || 0)), 0) + 1;
        this.data.forEach(e => {
            if (!e.id) e.id = `EMP${String(next++).padStart(3, '0')}`;
        });
    },
    save() {
        localStorage.setItem('ngu_employees', JSON.stringify(this.data));
    },
    add(name) {
        const id = `EMP${String(this.data.length + 1).padStart(3, '0')}`;
        const emp = {
            id, name, 
            holidayRemaining: 25,
            holidayTaken: 0,
            absenceDays: 0,
            bonus: 0,
            additionalPayments: 0,
            // Add more stats here
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
        if (emp) Object.assign(emp, updates);
        this.save();
        return emp;
    },
    exportCSV() {
        const headers = ['id', 'name', 'holidayRemaining', 'holidayTaken', 'absenceDays', 'bonus', 'additionalPayments'];
        let csv = headers.join(',') + '\n';
        this.data.forEach(e => {
            csv += headers.map(h => e[h] ?? '').join(',') + '\n';
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'employees.csv'; a.click();
    }
};

// Auto-init
EMPLOYEES.init();
