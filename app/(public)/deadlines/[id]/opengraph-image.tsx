import { ImageResponse } from 'next/og';
import { getDeadlineById, getSubjectById } from '@/lib/db';

export const alt = 'Class Deadline Hub - Chi tiết Deadline';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const deadline = await getDeadlineById(params.id);
  const subject = deadline ? await getSubjectById(deadline.subjectId) : null;

  const title = deadline?.title || 'Class Deadline Hub PTIT';
  const subjectName = subject ? `${subject.code} - ${subject.name}` : 'Môn học PTIT';
  const dueDateStr = deadline
    ? new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Hạn chót';

  const priorityLabel =
    deadline?.priority === 'urgent'
      ? 'KHẨN CẤP'
      : deadline?.priority === 'high'
      ? 'ƯU TIÊN CAO'
      : deadline?.priority === 'medium'
      ? 'TRUNG BÌNH'
      : 'BÌNH THƯỜNG';

  const priorityColor =
    deadline?.priority === 'urgent'
      ? '#e11d48'
      : deadline?.priority === 'high'
      ? '#f59e0b'
      : '#3b82f6';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              PTIT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f8fafc' }}>
                Class Deadline Hub
              </span>
              <span style={{ fontSize: '14px', color: '#94a3b8', letterSpacing: '1px' }}>
                HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              backgroundColor: priorityColor,
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold',
              letterSpacing: '1px',
            }}
          >
            {priorityLabel}
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#fb7185',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {subjectName}
          </div>
          <div
            style={{
              fontSize: '44px',
              fontWeight: '900',
              lineHeight: 1.2,
              color: '#ffffff',
              maxHeight: '160px',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #334155',
            paddingTop: '30px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>HẠN NỘP CHÍNH THỨC</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#f8fafc' }}>
              {dueDateStr}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '16px', color: '#cbd5e1' }}>
              Nộp qua: <strong style={{ color: '#38bdf8' }}>{deadline?.submissionType || 'LMS'}</strong>
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
