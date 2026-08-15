const sessions = new Map();

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = (req.query.path || '').toString().split('/').filter(Boolean);
  
  // Endpoint 1: POST /sessions (Create Session)
  if (req.method === 'POST' && path.length === 0) {
    const { name, state } = req.body || {};
    const code = generateCode();
    const hostId = 'p_' + Math.random().toString(36).substring(2, 10);
    
    const session = {
      code,
      hostName: name || 'Auralis listener',
      controllerId: hostId,
      controllerName: name || 'Auralis listener',
      stateVersion: 1,
      state: state || null,
      participants: [
        { id: hostId, name: name || 'Auralis listener', isHost: true }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    sessions.set(code, session);

    return res.status(200).json({
      code,
      participantId: hostId,
      joinUrl: `https://auralismusicapp.vercel.app/join?code=${code}`,
      participants: session.participants.length,
      participantList: session.participants,
      hostName: session.hostName,
      controllerId: session.controllerId,
      controllerName: session.controllerName,
      stateVersion: session.stateVersion,
      serverNow: Date.now(),
      state: session.state
    });
  }

  const sessionCode = (path[0] || '').toUpperCase();
  const action = path[1] || '';

  if (!sessionCode) {
    return res.status(400).json({ error: 'Missing session code' });
  }

  let currentSession = sessions.get(sessionCode);
  if (!currentSession) {
    const participantId = 'p_' + Math.random().toString(36).substring(2, 10);
    currentSession = {
      code: sessionCode,
      hostName: 'Auralis listener',
      controllerId: participantId,
      controllerName: 'Auralis listener',
      stateVersion: 1,
      state: null,
      participants: [
        { id: participantId, name: 'Auralis listener', isHost: true }
      ]
    };
    sessions.set(sessionCode, currentSession);
  }

  // Endpoint 2: POST /sessions/{code}/join
  if (req.method === 'POST' && action === 'join') {
    const { name } = req.body || {};
    const participantId = 'p_' + Math.random().toString(36).substring(2, 10);
    const pName = name || 'Friend';
    
    currentSession.participants.push({ id: participantId, name: pName, isHost: false });

    return res.status(200).json({
      code: currentSession.code,
      participantId,
      joinUrl: `https://auralismusicapp.vercel.app/join?code=${currentSession.code}`,
      participants: currentSession.participants.length,
      participantList: currentSession.participants,
      hostName: currentSession.hostName,
      controllerId: currentSession.controllerId,
      controllerName: currentSession.controllerName,
      stateVersion: currentSession.stateVersion,
      serverNow: Date.now(),
      state: currentSession.state
    });
  }

  // Endpoint 3: GET /sessions/{code}
  if (req.method === 'GET' && !action) {
    return res.status(200).json({
      code: currentSession.code,
      participantId: currentSession.controllerId,
      joinUrl: `https://auralismusicapp.vercel.app/join?code=${currentSession.code}`,
      participants: currentSession.participants.length,
      participantList: currentSession.participants,
      hostName: currentSession.hostName,
      controllerId: currentSession.controllerId,
      controllerName: currentSession.controllerName,
      stateVersion: currentSession.stateVersion,
      serverNow: Date.now(),
      state: currentSession.state
    });
  }

  // Endpoint 4: POST /sessions/{code}/state
  if (req.method === 'POST' && action === 'state') {
    const { participantId, state } = req.body || {};
    if (state) {
      currentSession.state = state;
      currentSession.stateVersion += 1;
      currentSession.updatedAt = Date.now();
    }

    return res.status(200).json({
      code: currentSession.code,
      participantId: participantId || currentSession.controllerId,
      joinUrl: `https://auralismusicapp.vercel.app/join?code=${currentSession.code}`,
      participants: currentSession.participants.length,
      participantList: currentSession.participants,
      hostName: currentSession.hostName,
      controllerId: currentSession.controllerId,
      controllerName: currentSession.controllerName,
      stateVersion: currentSession.stateVersion,
      serverNow: Date.now(),
      state: currentSession.state
    });
  }

  // Endpoint 5: POST /sessions/{code}/leave
  if (req.method === 'POST' && action === 'leave') {
    const { participantId } = req.body || {};
    if (participantId) {
      currentSession.participants = currentSession.participants.filter(p => p.id !== participantId);
    }
    return res.status(200).json({ success: true });
  }

  return res.status(404).json({ error: 'Route not found' });
}
