import { useTaskStore } from '../stores/TaskStore';
import { useUIStore } from '../stores/UIStore';
import { i18n } from '../utils/i18n';
import { getStatusColor } from '../utils/statusColors';
import { designTokens } from '../styles/designTokens';

export function TaskStatusColorControls() {
    const statuses = useTaskStore(state => state.taskStatuses);
    const { taskColorMode, statusColors, setTaskColorMode, setStatusColor, resetStatusColors } = useUIStore();

    return (
        <>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 32 }}>
                {i18n.t('label_task_color') || 'Color by'}
                <select value={taskColorMode} onChange={event => setTaskColorMode(event.target.value === 'status' ? 'status' : 'default')}>
                    <option value="default">{i18n.t('label_task_color_default') || 'Default'}</option>
                    <option value="status">{i18n.t('label_task_color_status') || 'Status'}</option>
                </select>
            </label>
            {taskColorMode === 'status' && statuses.length > 0 && (
                <fieldset style={{ margin: 0, border: `1px solid ${designTokens.borderSubtle}`, borderRadius: 6 }}>
                    <legend>{i18n.t('label_status_color_legend') || 'Status colors'}</legend>
                    {statuses.map(({ id, name }) => (
                        <label key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                            {name}
                            <input type="color" value={getStatusColor(id, statusColors)}
                                onChange={event => setStatusColor(id, event.target.value)} />
                        </label>
                    ))}
                    <button type="button" disabled={!Object.keys(statusColors).length} onClick={resetStatusColors}>
                        {i18n.t('label_reset_status_colors') || 'Reset status colors'}
                    </button>
                </fieldset>
            )}
        </>
    );
}
