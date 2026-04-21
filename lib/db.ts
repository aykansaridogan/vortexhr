import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const getFilePath = (model: string) => path.join(DATA_DIR, `${model}.json`);

const readData = (model: string) => {
  const filePath = getFilePath(model);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeData = (model: string, data: any) => {
  fs.writeFileSync(getFilePath(model), JSON.stringify(data, null, 2));
};

const generateId = () => Math.random().toString(36).substring(2, 11);

export const db = {
  job: {
    findMany: async (args?: any) => {
      const jobs = readData('jobs');
      const candidates = readData('candidates');
      return jobs.map((j: any) => ({
        ...j,
        createdAt: j.createdAt || new Date().toISOString(),
        _count: {
          candidates: candidates.filter((c: any) => c.jobId === j.id).length
        }
      }));
    },
    findUnique: async ({ where }: any) => {
      const jobs = readData('jobs');
      const candidates = readData('candidates');
      const job = jobs.find((j: any) => j.id === where.id);
      if (!job) return null;
      return {
        ...job,
        createdAt: job.createdAt || new Date().toISOString(),
        _count: {
          candidates: candidates.filter((c: any) => c.jobId === job.id).length
        }
      };
    },
    create: async ({ data }: any) => {
      const jobs = readData('jobs');
      const newJob = { 
        ...data, 
        id: generateId(), 
        createdAt: new Date().toISOString(),
        status: data.status || 'OPEN'
      };
      jobs.push(newJob);
      writeData('jobs', jobs);
      return { ...newJob, _count: { candidates: 0 } };
    }
  },
  candidate: {
    findMany: async (args?: any) => {
      const candidates = readData('candidates');
      const jobs = readData('jobs');
      const analyses = readData('analyses');
      
      return candidates.map((c: any) => ({
        ...c,
        job: jobs.find((j: any) => j.id === c.jobId),
        analysis: analyses.find((a: any) => a.candidateId === c.id)
      }));
    },
    findUnique: async ({ where }: any) => {
      const candidates = readData('candidates');
      const jobs = readData('jobs');
      const analyses = readData('analyses');
      const c = candidates.find((c: any) => c.id === where.id);
      if (!c) return null;
      return {
        ...c,
        job: jobs.find((j: any) => j.id === c.jobId),
        analysis: analyses.find((a: any) => a.candidateId === c.id)
      };
    },
    create: async ({ data }: any) => {
      const candidates = readData('candidates');
      const { analysis, ...candidateData } = data;
      const newCandidate = { ...candidateData, id: generateId(), createdAt: new Date().toISOString() };
      candidates.push(newCandidate);
      writeData('candidates', candidates);
      
      if (analysis && analysis.create) {
        const analyses = readData('analyses');
        const newAnalysis = { ...analysis.create, id: generateId(), candidateId: newCandidate.id, createdAt: new Date().toISOString() };
        analyses.push(newAnalysis);
        writeData('analyses', analyses);
      }
      return newCandidate;
    },
    update: async ({ where, data }: any) => {
      const candidates = readData('candidates');
      const index = candidates.findIndex((c: any) => c.id === where.id);
      if (index !== -1) {
        candidates[index] = { ...candidates[index], ...data };
        writeData('candidates', candidates);
        return candidates[index];
      }
    }
  },
  analysis: {
    create: async ({ data }: any) => {
      const analyses = readData('analyses');
      const newAnalysis = { 
        ...data, 
        id: Math.random().toString(36).substring(2, 11), 
        createdAt: new Date().toISOString() 
      };
      analyses.push(newAnalysis);
      writeData('analyses', analyses);
      return newAnalysis;
    }
  },
  employee: {
    findMany: async (args?: any) => {
      const employees = readData('employees');
      const jobs = readData('jobs');
      return employees.map((e: any) => ({
        ...e,
        job: jobs.find((j: any) => j.id === e.jobId)
      }));
    },
    create: async ({ data }: any) => {
      const employees = readData('employees');
      const newEmployee = { ...data, id: generateId(), createdAt: new Date().toISOString() };
      employees.push(newEmployee);
      writeData('employees', employees);
      return newEmployee;
    }
  },
  attendance: {
    findMany: async (args?: any) => {
      const { where } = args || {};
      const attendances = readData('attendances');
      const employees = readData('employees');
      
      let filtered = attendances;
      if (where?.checkIn?.gte) {
        const gte = new Date(where.checkIn.gte).getTime();
        filtered = attendances.filter((a: any) => new Date(a.checkIn).getTime() >= gte);
      }

      return filtered.map((a: any) => ({
        ...a,
        employee: employees.find((e: any) => e.id === a.employeeId)
      }));
    },
    findFirst: async ({ where, orderBy }: any) => {
      const attendances = readData('attendances');
      let filtered = attendances.filter((a: any) => a.employeeId === where.employeeId && (a.checkOut === null || a.checkOut === undefined));
      if (where.checkIn?.gte) {
        const gte = new Date(where.checkIn.gte).getTime();
        filtered = filtered.filter((a: any) => new Date(a.checkIn).getTime() >= gte);
      }
      return filtered[filtered.length - 1] || null;
    },
    create: async ({ data }: any) => {
      const attendances = readData('attendances');
      const newAtt = { ...data, id: generateId(), checkIn: new Date().toISOString() };
      attendances.push(newAtt);
      writeData('attendances', attendances);
      return newAtt;
    },
    update: async ({ where, data }: any) => {
      const attendances = readData('attendances');
      const index = attendances.findIndex((a: any) => a.id === where.id);
      if (index !== -1) {
        const checkOutDate = data.checkOut instanceof Date ? data.checkOut.toISOString() : data.checkOut;
        attendances[index] = { ...attendances[index], ...data, checkOut: checkOutDate };
        writeData('attendances', attendances);
        return attendances[index];
      }
    }
  }
};
