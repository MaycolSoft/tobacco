import { useCallback, useEffect, useRef, useState } from 'react';
import { useAnimationPerfStore } from '@/store/useAnimationPerfStore';
import { listFrameVariants, createFrameVariant, getFrameVariantJob, deleteFrameVariant } from '@/lib/frameVariantsApi';
import { isFinishedJob } from '@/lib/frameVariants';

// Kept mounted by the modal: closing it does not interrupt a server-side job.
export default function useFrameVariants(open) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pollError, setPollError] = useState('');
  const [busy, setBusy] = useState(false);
  const sequence = useRef(0);
  const actionLock = useRef(false);
  const job = useAnimationPerfStore(state => state.variantJob);
  const setJob = useAnimationPerfStore(state => state.setVariantJob);
  const removeSelection = useAnimationPerfStore(state => state.removeFrameVariant);
  const activeJob = Boolean(job && !isFinishedJob(job));

  const refresh = useCallback(async (signal) => {
    const request = ++sequence.current;
    setLoading(true);
    setListError('');
    try {
      const variants = await listFrameVariants(signal);
      if (request === sequence.current && !signal?.aborted) setItems(variants);
    } catch (error) {
      if (request === sequence.current && error.name !== 'AbortError') setListError(error.message);
    } finally {
      if (request === sequence.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    refresh(controller.signal);
    return () => controller.abort();
  }, [open, refresh]);

  const jobId = job?.id;
  useEffect(() => {
    if (!jobId || !activeJob) return;
    const controller = new AbortController();
    let timer;
    let failures = 0;
    const poll = async () => {
      try {
        const next = await getFrameVariantJob(jobId, controller.signal);
        if (controller.signal.aborted) return;
        failures = 0;
        setPollError('');
        setJob(next);
        if (isFinishedJob(next)) {
          await refresh();
          return;
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        failures++;
        setPollError(`${error.message} Progress polling will retry automatically.`);
      }
      if (!controller.signal.aborted) timer = setTimeout(poll, Math.min(1500 * (failures + 1), 10000));
    };
    poll();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [jobId, activeJob, refresh, setJob]);

  const create = async (body) => {
    if (actionLock.current || activeJob) return;
    actionLock.current = true;
    setBusy(true);
    setActionError('');
    setPollError('');
    try {
      const next = await createFrameVariant(body);
      setJob(next);
      if (isFinishedJob(next)) await refresh();
    } catch (error) {
      setActionError(error.message);
    } finally {
      actionLock.current = false;
      setBusy(false);
    }
  };

  const remove = async (variant) => {
    if (actionLock.current || activeJob) return;
    actionLock.current = true;
    setBusy(true);
    setActionError('');
    try {
      await deleteFrameVariant(variant);
      removeSelection(variant.name);
      await refresh();
    } catch (error) {
      setActionError(error.message);
    } finally {
      actionLock.current = false;
      setBusy(false);
    }
  };

  return { items, loading, listError, actionError, pollError, busy, job, activeJob, refresh, create, remove };
}
