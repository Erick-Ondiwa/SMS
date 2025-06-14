import React from 'react';
import StudentRow from './StudentRow';
import styles from './StudentTable.module.css';

const StudentTable = ({ students, onEdit, onDelete, isAdmin }) => {
  const validStudents = Array.isArray(students) ? students : [];

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Full Name</th>
            <th className={styles.th}>Admission No.</th>
            <th className={styles.th}>Gender</th>
            <th className={styles.th}>DOB</th>
            <th className={styles.th}>Phone</th>
            {isAdmin && <th className={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {validStudents.length > 0 ? (
            validStudents.map((student) => (
              <StudentRow
                key={student.studentId}
                student={student}
                onEdit={onEdit}
                onDelete={onDelete}
                isAdmin={isAdmin}
              />
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? 6 : 5} className={styles.emptyMessage}>
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;



// import React from 'react';
// import StudentRow from './StudentRow';
// import styles from './StudentTable.module.css';

// const StudentTable = ({ students, onEdit, onDelete, isAdmin }) => {
//   return (
//     <div className={styles.tableWrapper}>
//       <table className={styles.table}>
//         <thead className={styles.thead}>
//           <tr>
//             <th className={styles.th}>Full Name</th>
//             <th className={styles.th}>Admission No.</th>
//             <th className={styles.th}>Gender</th>
//             <th className={styles.th}>DOB</th>
//             <th className={styles.th}>Phone</th>
//             {isAdmin && <th className={styles.th}>Actions</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {students.length > 0 ? (
//             students.map((student) => (
//               <StudentRow
//                 key={student.studentId}
//                 student={student}
//                 onEdit={onEdit}
//                 onDelete={onDelete}
//                 isAdmin={isAdmin}
//               />
//             ))
//           ) : (
//             <tr>
//               <td colSpan={isAdmin ? 6 : 5} className={styles.emptyMessage}>
//                 No students found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default StudentTable;
